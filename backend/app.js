import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
// Additional routes will be imported here as they are created

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);

// Placeholder for remaining routes (to be expanded)
// app.use('/api/categories', categoryRoutes);
// app.use('/api/collections', collectionRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/coupons', couponRoutes);
// app.use('/api/admin/analytics', analyticsRoutes);
// app.use('/api/admin/categories', adminCategoryRoutes);
// app.use('/api/admin/orders', adminOrderRoutes);
// app.use('/api/admin/customers', adminCustomerRoutes);
// app.use('/api/admin/settings', adminSettingsRoutes);
// app.use('/api/ai/chat', aiChatRoutes);
// app.use('/api/ai/admin-assistant', aiAdminRoutes);
// app.use('/api/support', supportRoutes);
// app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use(errorHandler);

export default app;
