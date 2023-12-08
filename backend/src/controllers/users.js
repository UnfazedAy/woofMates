import User from '../models/User.js';
import ErrorResponse from '../helpers/errorResponse.js';
import asyncHandler from 'express-async-handler';

const getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    ...res.advancedResults,
    message: 'User(s) retrieved successfully',
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
  const fieldsToUpdate = {
    firstname: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    bio: req.body.bio,
    address: req.body.address,
  };
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }
  // Make sure user is updating their own account
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this user`,
        401,
      ),
    );
  }
  user = await User.findOneAndUpdate({ '_id': req.params.id }, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
    message: 'User updated successfully',
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
    );
  }
  // Make sure user is deleting their own account
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this user`,
        401,
      ),
    );
  }
  user = await User.deleteOne({ '_id': req.params.id });
  res.status(200).json({
    success: true,
    data: {},
    message: 'User deleted successfully',
  });
});

export { getAllUsers, getUser, updateUser, deleteUser };
