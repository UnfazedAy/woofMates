import express from 'express';
import keys from './config/keys.js';
import connectDB from './config/db.js';
import logger from './helpers/logger.js';
import colors from 'colors';

const { PORT, HOST } = keys;

connectDB();
const app = express();

const server = app.listen(
  PORT,
  logger.info(
    `Server running in ${process.env.NODE_ENV} mode on http://${HOST}:${PORT}`.yellow.bold,
  ),
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Error: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default server;
