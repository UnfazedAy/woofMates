import asyncHandler from 'express-async-handler';
import Dog from '../models/Dog.js';
import ErrorResponse from '../helpers/errorResponse.js';

const createUserDog = asyncHandler(async (req, res, next) => {
  const dog = await Dog.create(req.body);
  res.status(201).json({
    success: true,
    data: dog,
    message: 'Dog created successfully',
  });
});
