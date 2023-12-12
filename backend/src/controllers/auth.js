import User from '../models/User.js';
import ErrorResponse from '../helpers/errorResponse.js';
import asyncHandler from 'express-async-handler';
import keys from '../config/keys.js';

const { JWT_COOKIE_EXPIRES_IN, NODE_ENV } = keys;

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ), // 30 days
    httpOnly: true,
  };

  if (NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user,
      message,
    });
};

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

export { register, login, sendTokenResponse };
