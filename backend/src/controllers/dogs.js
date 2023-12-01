import asyncHandler from 'express-async-handler';
import Dog from '../models/Dog.js';
import uploader from '../helpers/cloudinary.js';
import ErrorResponse from '../helpers/errorResponse.js';
import { bufferToDataUri } from '../middlewares/multer.js';

const createUserDog = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length < 3) {
    return next(new ErrorResponse('Please upload at least 3 dog images', 400));
  }

});
