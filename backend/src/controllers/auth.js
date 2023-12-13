import User from '../models/User.js';
import ErrorResponse from '../helpers/errorResponse.js';
import asyncHandler from 'express-async-handler';
import sendTokenResponse from '../helpers/authHelper.js';

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
  
});

export { register, login, sendTokenResponse };
