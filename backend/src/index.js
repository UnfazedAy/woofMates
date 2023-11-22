import express from 'express';
import keys from './config/keys.js';
import connectDB from './config/db.js';
import logger from './helpers/logger.js';
// eslint-disable-next-line no-unused-vars
import colors from 'colors';
import morgan from 'morgan';
import userRouter from './routes/users.js';
import errorHandler from './middlewares/error.js';

const { PORT, HOST, NODE_ENV } = keys;

connectDB();
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/users', userRouter);

// Error handler
app.use(errorHandler);

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
