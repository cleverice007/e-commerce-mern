import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';
import redisClient from './config/redis.js';
import { serialize } from './utils/redisHelper.js';


dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    for (const product of sampleProducts) {
      const newProduct = await Product.create(product);
      console.log('New product object:', newProduct.toObject());
      const productData = serialize(newProduct.toObject());
      console.log(`Serialized data for product ${newProduct._id}:`, productData);
      await redisClient.hSet(`product:${newProduct._id}`, productData);

      // add rating to sorted set in Redis
      const productRating = newProduct.rating
      // use negative rating as score to sort from high to low
      await redisClient.zAdd('productsSortedByRating', {
        score: -productRating,
        value: newProduct._id.toString(),
      });
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};



const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // delete all products in Redis
    const productsInRedis = await redisClient.keys('product:*');
    for (const key of productsInRedis) {
      await redisClient.del(key);
    }

    // delete the sorted set in Redis
    await redisClient.del('productsSortedByRating');

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};


if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}