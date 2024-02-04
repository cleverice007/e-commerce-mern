import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { promises as fs } from 'fs';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';


import { notFound, errorHandler } from './middleware/errordMiddleware.js';
dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);



const __dirname = path.dirname(new URL(import.meta.url).pathname);

console.log("Current directory:", __dirname);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  console.log("Serving static files from:", buildPath);

  // 使用 promises API 的 readdir 和 access 方法
  fs.readdir(buildPath)
    .then(files => console.log("Files in build directory:", files))
    .catch(err => console.error("Cannot read build directory:", err));

  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    const indexPath = path.resolve(buildPath, 'index.html');
    console.log("Serving index.html from:", indexPath);

    fs.access(indexPath)
      .then(() => {
        console.log("index.html exists, sending file...");
        res.sendFile(indexPath);
      })
      .catch(err => {
        console.error("index.html not found:", err);
        res.status(404).send('Not found');
      });
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
