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

      // 添加产品评分和 ID 到 Redis 的 Sorted Set
      const productRating = newProduct.rating;
      await redisClient.zAdd('productsSortedByRating', {
        score: productRating,
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

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}