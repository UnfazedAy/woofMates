import User from '../models/User.js';
import ErrorResponse from '../helpers/errorResponse.js';
import asyncHandler from 'express-async-handler';
import { bufferToDataUri } from '../middlewares/multer.js';
import uploader from '../helpers/cloudinary.js';
import bcrypt from 'bcrypt';

const userProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: user,
    message: 'User profile retrieved successfully',
  });
});

const updateAvatar = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.user.id}`, 404),
      );
    }

    // Extract file information
    const { mimetype, buffer } = req.file;
    const fileFormat = mimetype.split('/')[1];
    const file = bufferToDataUri(`.${fileFormat}`, buffer).content;

    // Upload the image using the uploader function
    const imageUrl = await uploader(
      file,
      'woofMates Users',
      user.email,
      'avatar',
    );

    // Handle image upload failure
    if (!imageUrl) {
      return next(new ErrorResponse('Error uploading image', 500));
    }

    // Update user's avatar and save changes
    const avatar = { avatar: imageUrl };
    const updateUserAvatar = await User.findByIdAndUpdate(
      req.user.id,
      avatar,
      { new: true, runValidators: true },
    );

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

const changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user.id}`, 404),
    );
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Check if current password is correct
  if (!currentPassword) {
    return next(new ErrorResponse('Please provide your current password', 400));
  }
  // Check if new password is provided
  if (!newPassword || newPassword.length < 6) {
    return next(
      new ErrorResponse(
        'Please provide a new password of at least 6 characters', 400,
      ),
    );
  }
  // Check if confirm password is provided
  if (!confirmPassword || confirmPassword.length < 6) {
    return next(
      new ErrorResponse(
        'Please provide a new password of at least 6 characters', 400,
      ),
    );
  }
  // Check if current password is correct
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorResponse('New password and confirm password do not match', 400),
    );
  }

  // Hash new password and save changes
  const salt = await bcrypt.genSalt(10);
  const userNewPassword = await bcrypt.hash(newPassword, salt);
  const updateUserPassword = { password: userNewPassword };
  await User.findByIdAndUpdate(
    user.id, updateUserPassword, {
      new: true,
      runValidators: true,
    });

  // Respond with success message
  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

export { userProfile, updateAvatar, changePassword };
