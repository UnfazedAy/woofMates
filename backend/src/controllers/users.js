import User from '../models/User.js';

const createUser = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
};

export { createUser };
