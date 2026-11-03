const mongoose = require('mongoose');

/**
 * Robust MongoDB Connection with Event Listeners & Serverless Reuse
 */
let isConnecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return isConnecting;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    const errorMsg = 'Fatal Error: MONGO_URI is missing in environment variables.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    isConnecting = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    const conn = await isConnecting;
    isConnecting = null;
    return conn;
  } catch (error) {
    isConnecting = null;
    console.error(`[Database Error] Failed to connect: ${error.message}`);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database Error]', err);
});

module.exports = connectDB;
