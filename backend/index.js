import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';



import { notFound, errorHandler } from './middleware/errordMiddleware.js';
dotenv.config();

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


app.use(notFound);
app.use(errorHandler);

const __dirname = path.resolve();
console.log("Current directory:", __dirname);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  console.log("Serving static files from:", buildPath);

  const fs = require('fs');
  fs.readdir(buildPath, (err, files) => {
    if (err) {
      console.error("Cannot read build directory:", err);
    } else {
      console.log("Files in build directory:", files);
    }
  });

  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    const indexPath = path.resolve(buildPath, 'index.html');
    console.log("Serving index.html from:", indexPath);
    
    fs.access(indexPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("index.html not found:", err);
      } else {
        console.log("index.html exists, sending file...");
        res.sendFile(indexPath);
      }
    });
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
