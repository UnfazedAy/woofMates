import ErrorResponse from '../helpers/errorResponse.js';
import logger from '../helpers/logger.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // Log to console for dev
  logger.error(err.stack.red);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = Object.keys(err.keyValue).map(
      (key) => `Duplicate key error, ${key} already exists`);
    error = new ErrorResponse(message, 400);
  }


  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    logger.error(message);
    error = new ErrorResponse(message, 400);
  }

  // Multer file size error
  if (err.name === 'MulterError') {
    const message = 'File size too large, file should not be more than 3MB';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
