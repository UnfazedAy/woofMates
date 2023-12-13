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

export default sendTokenResponse;
