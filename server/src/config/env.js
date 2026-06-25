import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  credentialEncryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY
};