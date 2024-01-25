import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import redisClient from '../config/redis.js';
import { serialize,deserialize } from '../utils/redisHelper.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  // get index of products sorted by rating from Redis
  const start = (page - 1) * pageSize;
  const stop = page * pageSize - 1;
  const productIds = await redisClient.zRevRange('productsSortedByRating', start, stop);

  // get products data from Redis
  const products = [];
  for (const id of productIds) {
    const productData = await redisClient.hGetAll(`product:${id}`);
    products.push(productData);
  }

  res.json({ products, page, pages: Math.ceil(productIds.length / pageSize) });
});

  
  // @desc    Fetch single product
  // @route   GET /api/products/:id
  // @access  Public
  const getProductById = asyncHandler(async (req, res) => {
    try {
      const serializedProductData = await redisClient.hGetAll(`product:${req.params.id}`);
  
      // 檢查是否找到了產品
      if (serializedProductData && Object.keys(serializedProductData).length !== 0) {
        // 反序列化產品數據
        const productData = deserialize(serializedProductData);
        console.log(`Product with ID ${req.params.id} found in Redis.`);
        console.log(productData)
        return res.json(productData);
      } else {
        console.log(`Product with ID ${req.params.id} not found in Redis.`);
        res.status(404);
        throw new Error('Resource not found');
      }
    } catch (error) {
      console.error('Error fetching product from Redis:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (product) {
    // 從 MongoDB 刪除產品
    await Product.deleteOne({ _id: product._id });

    // 從 Redis 刪除產品
    await redisClient.del(`product:${productId}`);

    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});



// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    const productData = serialize(product.toObject());
    await redisClient.hSet(`product:${productId}`, productData);

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

  
  export { getProducts, getProductById, deleteProduct, createProductReview };