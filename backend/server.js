import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Only start listening after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`
🚀 AI Commerce Platform Backend
   Environment: ${process.env.NODE_ENV || 'development'}
   Port: ${PORT}
   Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}
   MongoDB: Connected
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
      });
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
