import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  if (!config.mongoUri) {
    console.warn('⚠️ No MONGO_URI provided. Running app with local in-memory mock fallback state.');
    return false;
  }

  try {
    await mongoose.connect(config.mongoUri);
    console.log('✨ MongoDB Connected Securely.');
    return true;
  } catch (err) {
    console.error(`❌ MongoDB Connection Failure: ${err.message}`);
    console.warn('⚠️ Falling back to application-level memory mock engine.');
    return false;
  }
};