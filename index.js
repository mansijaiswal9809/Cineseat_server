import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

const app = express();


const FRONTEND_URL = 'http://localhost:5173';

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, 
  })
)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import cookieParser from "cookie-parser";
app.use(cookieParser());


if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cineseat')
.then(() => console.log('MongoDB connected', process.env.MONGODB_URI))
.catch(err => console.error('MongoDB connection error:', err));

import movieRoutes from './routes/movieRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRouter from './routes/auth.js'; 

const api = express.Router();
api.use('/auth', authRouter);
api.use('/movies', movieRoutes);
api.use('/bookings', bookingRoutes);
app.use('/api', api);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = parseInt(process.env.PORT, 10) || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 CineSeat server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

const shutdown = (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Force shutdown after 10s.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
