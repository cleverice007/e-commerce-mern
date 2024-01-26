import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import redisClient from '../config/redis.js';
import { serialize, deserialize } from '../utils/redisHelper.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = parseInt(process.env.PAGINATION_LIMIT, 10);
    const page = parseInt(req.query.pageNumber, 10) || 1;

    console.log('PageSize:', pageSize, 'Page Number:', page);

    // Get the total count of products
    const totalCount = await redisClient.zCard('productsSortedByRating');
    const totalPages = Math.ceil(totalCount / pageSize);

    const start = (page - 1) * pageSize;
    const stop = page * pageSize - 1;
    
    
    console.log('Redis Range Query Start:', start, 'Stop:', stop);
    
    // use ZRANGE to get the product IDs
    const productIds = await redisClient.ZRANGE('productsSortedByRating', start, stop);
    // Retrieve product data from Redis
    const products = [];
    for (const id of productIds) {
      const productData = await redisClient.hGetAll(`product:${id}`);
      console.log(`Product ID: ${id}, Rating: ${productData.rating}`);
      products.push(productData);
    }



    console.log('Sending Response with Products:', products.length, 'Page:', page, 'Total Pages:', totalPages);
    res.json({ products, page, pages: totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});




// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id.trim(); // trim() removes whitespace from both ends of a string
    console.log('Requested Product ID:', productId);

    const redisKey = `product:${productId}`;
    console.log('Redis Key:', redisKey);

    const serializedProductData = await redisClient.hGetAll(redisKey);
    console.log('Serialized Product Data:', serializedProductData);

    if (serializedProductData && Object.keys(serializedProductData).length !== 0) {
      const productData = deserialize(serializedProductData);
      console.log('Deserialized Product Data:', productData);
      return res.json(productData);
    } else {
      console.log(`Product with ID ${productId} not found in Redis.`);
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