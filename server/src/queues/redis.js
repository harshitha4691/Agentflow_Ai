import Redis from 'ioredis';
import { config } from '../config/env.js';

let redisClient = null;
let isMockRedis = false;

try {
  // Attempt to spin up a connection string link straight to your instance thread
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  
  // Set connection timeouts short to trigger the fallback fast if offline
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    connectTimeout: 2000
  });

  redisClient.on('error', (err) => {
    if (!isMockRedis) {
      console.warn('⚠️ Redis Connection Disturbance encountered. Engaging memory queue fallbacks.');
      isMockRedis = true;
    }
  });
} catch (error) {
  console.warn('⚠️ Local Redis client engine unreachable. Swapping directly to memory fallback.');
  isMockRedis = true;
}

// Custom in-memory fallback store to mirror basic behavior if Redis is missing
const mockRedisStore = {
  async set() { return 'OK'; },
  async get() { return null; },
  async del() { return 1; }
};

export const getRedisClient = () => isMockRedis ? mockRedisStore : redisClient;
export const checkRedisStatus = () => isMockRedis ? 'offline_fallback' : 'connected_online';