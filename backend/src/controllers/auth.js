import User from '../models/User.js';
import ErrorResponse from '../helpers/errorResponse.js';
import asyncHandler from 'express-async-handler';
import sendTokenResponse from '../helpers/authHelper.js';
import sendEmail from '../helpers/sendEmail.js';
import logger from '../helpers/logger.js';
import crypto from 'crypto';

const register = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return next(new ErrorResponse('Email already exists', 400));
  }
  const user = await User.create(req.body);
  sendTokenResponse(user, 201, res, 'User created successfully');
  next();
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide an email and password', 400),
    );
  }
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(
      new ErrorResponse('Invalid credentials', 401),
    );
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res, 'User logged in successfully');
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorResponse('There is no user with that email', 404),
    );
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `
      You are receiving this email because you (or someone else)
      has requested the reset of a password.
      Please make a PUT request to: \n\n ${resetUrl}
    `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (err) {
    logger.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() } },
  );
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  // Save user
  await user.save({ validateBeforeSave: false });
  sendTokenResponse(user, 200, res, 'Password reset successful');
});

export { register, login, forgotPassword, resetPassword };
