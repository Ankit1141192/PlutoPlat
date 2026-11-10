const mongoose = require('mongoose');

/**
 * Robust MongoDB Connection with Event Listeners & Serverless Reuse
 */
let isConnecting = null;

const DEFAULT_MONGO_URI = 'mongodb+srv://ankit2914978_db_user:qXdyWvZPWB3Ac45R@cluster0.b8xd9bf.mongodb.net/plutoplat?retryWrites=true&w=majority';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return isConnecting;
  }

  let uri = process.env.MONGO_URI;

  if (!uri && process.env.MONGODB_PASSWORD) {
    const username = process.env.MONGODB_USERNAME || 'ankit2914978_db_user';
    uri = `mongodb+srv://${username}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0.b8xd9bf.mongodb.net/plutoplat?retryWrites=true&w=majority`;
  }

  if (!uri) {
    uri = DEFAULT_MONGO_URI;
  }

  // Ensure uri has database name if it's cluster0 without db
  if (uri.includes('.mongodb.net') && !uri.includes('.mongodb.net/')) {
    uri = uri.replace('.mongodb.net', '.mongodb.net/plutoplat?retryWrites=true&w=majority');
  }

  try {
    isConnecting = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: process.env.NODE_ENV !== 'production',
      bufferCommands: true,
    });

    const conn = await isConnecting;
    isConnecting = null;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.name || 'plutoplat'}`);
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
  console.error('[Database Error]', err.message);
});

module.exports = connectDB;
