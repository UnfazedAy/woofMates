import User from '../models/User.js';
import ErrorResponse from '../helpers/errorResponse.js';
import asyncHandler from 'express-async-handler';

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
    message: 'Users retrieved successfully',
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: user,
    message: 'User retrieved successfully',
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const updatedData = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: user,
    message: 'User updated successfully',
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: {},
    message: 'User deleted successfully',
  });
});

export { getAllUsers, getUser, updateUser, deleteUser };
