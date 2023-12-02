import asyncHandler from 'express-async-handler';
import Dog from '../models/Dog.js';
import uploader from '../helpers/cloudinary.js';
import ErrorResponse from '../helpers/errorResponse.js';
import { bufferToDataUri } from '../middlewares/multer.js';

const createUserDog = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length < 3) {
    return next(new ErrorResponse('Please upload at least 3 dog images', 400));
  }
  const dogImages = req.files.filter(
    (file) => file.fieldname === 'dogImages',
  );
  const dogImagesUrls = [];
  for (const image of dogImages) {
    const { mimetype, buffer } = image;
    const fileFormat = mimetype.split('/')[1];
    const file = bufferToDataUri(`.${fileFormat}`, buffer).content;
    const imageUrl = await uploader(
      file,
      'woofMates Dogs',
      req.user.email,
      'dog',
    );
    if (!imageUrl) {
      return next(new ErrorResponse('Error uploading image', 500));
    }
    dogImagesUrls.push(imageUrl);
  }

  const dogData = {
    name: req.body.name,
    gender: req.body.gender,
    breed: req.body.breed,
    age: req.body.age,
    owner: req.user._id,
    bio: req.body.bio,
    dogImages: {
      dogImage_1: dogImagesUrls[0],
      dogImage_2: dogImagesUrls[1],
      dogImage_3: dogImagesUrls[2],
    },
    relationship_preference: req.body.relationship_preference,
  };
  const dog = await Dog.create(dogData);
  res.status(201).json({
    success: true,
    data: dog,
    message: 'Dog created successfully',
  });
});

export { createUserDog };
