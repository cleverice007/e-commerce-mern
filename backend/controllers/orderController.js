import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import redisClient from '../config/redis.js';
import { serialize, deserialize,serializeOrder,deserializeOrder } from '../utils/redisHelper.js';

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

  const order = new Order({
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id.replace(/["']/g, ""), // remove quotes from the id
      _id: undefined,
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

  console.log('Cached order from Redis:', cachedOrder);

  if (cachedOrder && Object.keys(cachedOrder).length !== 0) {
    order = deserialize(cachedOrder);
    console.log('Deserialized order:', order);
  } else {
    order = await Order.findById(orderId).populate('user', 'name email');
    console.log('Order from MongoDB:', order);

    if (order) {
      const serializedOrder = serialize(order.toObject());
      console.log('Serialized order:', serializedOrder); // 新增打印序列化后的订单
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

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    //  update the order in Redis
    const serializedOrder = serialize(updatedOrder.toObject());
    await redisClient.hSet(`order:${orderId}`, serializedOrder);

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
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

    // update the order in Redis
    const serializedOrder = serialize(updatedOrder.toObject());
    await redisClient.hSet(`order:${orderId}`, serializedOrder);

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
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