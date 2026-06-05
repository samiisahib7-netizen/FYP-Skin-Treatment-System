/**
 * MongoDB connection helper.
 * Reads MONGO_URI from .env and connects via Mongoose.
 */
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set in environment');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  // eslint-disable-next-line no-console
  console.log('[db] connected to MongoDB Atlas');
}

module.exports = connectDB;
