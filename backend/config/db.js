const mongoose = require('mongoose');

/**
 * Robust MongoDB Connection with Event Listeners & Serverless Reuse
 * Fully compatible with Cloudflare Workers (direct shard hosts avoiding unsupported DNS SRV lookups).
 */
let isConnecting = null;

const DIRECT_ATLAS_URI =
  'mongodb://ankit2914978_db_user:qXdyWvZPWB3Ac45R@ac-bmca6rw-shard-00-00.b8xd9bf.mongodb.net:27017,ac-bmca6rw-shard-00-01.b8xd9bf.mongodb.net:27017,ac-bmca6rw-shard-00-02.b8xd9bf.mongodb.net:27017/plutoplat?ssl=true&replicaSet=atlas-5yewnm-shard-0&authSource=admin&retryWrites=true&w=majority';

const resolveMongoUri = () => {
  let uri = process.env.MONGO_URI || DIRECT_ATLAS_URI;

  // Cloudflare Workers runtime cannot resolve DNS SRV records (+srv)
  // Convert standard cluster0.b8xd9bf.mongodb.net SRV URI to direct shard hosts
  if (uri.startsWith('mongodb+srv://') && uri.includes('cluster0.b8xd9bf.mongodb.net')) {
    const credentialsMatch = uri.match(/mongodb\+srv:\/\/([^@]+)@/);
    const credentials = credentialsMatch ? credentialsMatch[1] : 'ankit2914978_db_user:qXdyWvZPWB3Ac45R';
    return `mongodb://${credentials}@ac-bmca6rw-shard-00-00.b8xd9bf.mongodb.net:27017,ac-bmca6rw-shard-00-01.b8xd9bf.mongodb.net:27017,ac-bmca6rw-shard-00-02.b8xd9bf.mongodb.net:27017/plutoplat?ssl=true&replicaSet=atlas-5yewnm-shard-0&authSource=admin&retryWrites=true&w=majority`;
  }

  return uri;
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return isConnecting;
  }

  const uri = resolveMongoUri();

  try {
    isConnecting = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: false,
      bufferCommands: false,
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
  console.error('[Database Error] Connection runtime error:', err.message);
});

module.exports = connectDB;
