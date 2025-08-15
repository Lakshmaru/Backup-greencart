import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import sellerRoute from './routes/sellerRoute.js';
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';
import cartRoute from './routes/cartRoute.js';
import addressRoute from './routes/addressRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB();
    await connectCloudinary();

    app.use(
      cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(cookieParser());

    app.use('/api/seller', sellerRoute);
    app.use('/api/product', productRoute);
    app.use('/api/user', userRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/address', addressRoute);

    app.get('/', (req, res) => res.send('API is working'));

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
