const path = require('path');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');
const { seedInitialData } = require('./utils/seedData');
const { initSocket } = require('./utils/socketService');

const PORT = process.env.PORT || 5000;

// Catch Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
  process.exit(1);
});

let server;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Auto seed initial dataset if empty
    await seedInitialData();

    // Create HTTP Server
    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` PlutoPlat Platform API Server Running on Port: ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('[CRITICAL] Server initialization failed:', error.message);
    process.exit(1);
  }
};

startServer();

// Catch Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('[CRITICAL] Unhandled Rejection:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  console.log(`[Process] ${signal} received. Closing HTTP server gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('[Process] HTTP server closed.');
      const mongoose = require('mongoose');
      await mongoose.connection.close(false);
      console.log('[Database] MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
