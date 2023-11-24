import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../helpers/errorResponse.js';
import User from '../models/User.js';
import keys from '../config/keys.js';

const { JWT_SECRET } = keys;

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // Check if token exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }
  // Check if token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token', 401));
    }
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403,
        ),
      );
    }
    next();
  };
};

export { protect, authorize };
