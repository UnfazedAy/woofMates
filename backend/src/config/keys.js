import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

const keys = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
  GEOCODER_API_KEY: process.env.GEOCODER_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
};

export default keys;
