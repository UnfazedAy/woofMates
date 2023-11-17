import User from '../models/User.js';
import ErrorResponse from '../helpers/errorResponse.js';
// import asyncHandler from 'express-async-handler';
import asyncHandler from '../middlewares/async.js';
import { bufferToDataUri } from '../middlewares/multer.js';
import uploader from '../helpers/cloudinary.js';

const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
    message: 'User created successfully',
  });
});

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

const updateAvatar = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404),
      );
    }

    // Extract file information
    const { mimetype, buffer } = req.file;
    const fileFormat = mimetype.split('/')[1];
    const file = bufferToDataUri(`.${fileFormat}`, buffer).content;

    // Upload the image using the uploader function
    const imageUrl = await uploader(
      file, 'woofMates Users', user.email, 'avatar',
    );

    // Handle image upload failure
    if (!imageUrl) {
      return next(new ErrorResponse('Error uploading image', 500));
    }

    // Update user's avatar and save changes
    const avatar = { avatar: imageUrl };
    const updateUserAvatar = await User.findByIdAndUpdate(
      req.params.id, avatar,
      { new: true, runValidators: true });

    // Respond with success message and updated user data
    res.status(200).json({
      success: true,
      data: updateUserAvatar,
      message: 'User avatar uploaded successfully',
    });
  } catch (err) {
    // Handle any other errors that occur during the process
    return next(new ErrorResponse(`${err.message}`, 500));
  }
});

export { createUser, updateAvatar, getUser, getAllUsers };
