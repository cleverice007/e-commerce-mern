import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { redisClient } from '../config/redis.js';
import { serialize, deserialize, serializeOrder, acquireLock, releaseLock } from '../utils/redisHelper.js';


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  // check if all products are in stock
  const itemsStock = await Promise.all(orderItems.map(async item => {
    console.log(`Checking stock for product ID: ${item.product}`);
    const product = await Product.findById(item.product);
    if (!product) {
      return false;
    }
    const isInStock = product.countInStock >= item.qty;
    if (!isInStock) {
      console.log(`Product out of stock: ${item.product}, requested: ${item.qty}, in stock: ${product.countInStock}`); // 如果库存不足，打印详细信息
    }
    return isInStock;
  }));

  if (itemsStock.includes(false)) {
    return res.status(400).json({ message: 'One or more products are out of stock.' });
  }

  // create order
  const order = new Order({
    orderItems: orderItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.product,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  try {
    const createdOrder = await order.save();

    // serialize the order
    const serializedOrder = serializeOrder(createdOrder.toObject());
    const orderId = `order:${createdOrder._id}`;

    // store each field of the order in Redis hash
    for (const [key, value] of Object.entries(serializedOrder)) {
      await redisClient.hSet(orderId, key, value);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const cachedOrder = await redisClient.hGetAll(`order:${orderId}`);
  let order;


  if (cachedOrder && Object.keys(cachedOrder).length !== 0) {
    order = deserialize(cachedOrder);
  } else {
    order = await Order.findById(orderId).populate('user', 'name email');

    if (order) {
      const serializedOrder = serialize(order.toObject());
      await redisClient.hSet(`order:${orderId}`, serializedOrder);
    }
  }

  if (order) {
    console.log('Final order to send:', order);
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});


// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  const lockKeys = order.orderItems.map(item => `locks:product:${item.product}`);
  let locksAcquired = [];

  try {
    // try to acquire locks for all products in the order
    for (const key of lockKeys) {
      const lockAcquired = await acquireLock(redisClient, key);
      if (!lockAcquired) {
        throw new Error("Failed to acquire lock");
      }
      locksAcquired.push(key);
    }

    // update product stock and order status
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.countInStock < item.qty) {
        throw new Error(`Product ${product.name} out of stock.`);
      }
      product.countInStock -= item.qty;
      await product.save();
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };



    const updatedOrder = await order.save();


    // update order in Redis
    const serializedOrder = serializeOrder(updatedOrder.toObject());
    const orderKey = `order:${orderId}`;
    // 使用 map 和 Promise.all 更新 Redis
    await Promise.all(
      Object.entries(serializedOrder).map(([key, value]) =>
        redisClient.hSet(orderKey, key, value)
      )
    );

    // 檢查 Redis 中的數據
    const cachedOrder = await redisClient.hGetAll(orderKey);

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error during order payment processing:", error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  } finally {
    // release locks for all products
    locksAcquired.forEach(key => releaseLock(redisClient, key).catch(console.error));
  }
});




// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // get orders from Redis
  const cachedOrders = await redisClient.get("orders");

  if (cachedOrders) {
    // if Redis has orders data, return it
    const orders = JSON.parse(cachedOrders);
    res.json(orders);
  } else {
    // if Redis does not have orders data, get it from MongoDB
    const orders = await Order.find({}).populate('user', 'id name');

    // store orders data in Redis
    await redisClient.set("orders", JSON.stringify(orders), 'EX', 60 * 60); // set expiration to 1 hour

    // return orders data
    res.json(orders);
  }
});


// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    try {
      const serializedOrder = serializeOrder(updatedOrder.toObject());
      const orderKey = `order:${orderId}`;
      // use object destructuring to store each field of the order in Redis hash
      for (const [key, value] of Object.entries(serializedOrder)) {
        await redisClient.hSet(orderKey, key, value);
      }
    } catch (error) {
      console.error("Error updating order in Redis:", error);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }

    res.json(updatedOrder);
  } else {
    console.error("Order not found, Order ID:", orderId);
    res.status(404).json({ message: 'Order not found' });
  }
});



export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered
};