import User from '../models/User.js';
// import ErrorResponse from '../helpers/errorResponse.js';
import asyncHandler from 'express-async-handler';

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
    message: 'Users retrieved successfully',
  });
  next();
});

export { getAllUsers };
