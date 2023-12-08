import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Dog from '../models/Dog.js';
import uploader from '../helpers/cloudinary.js';
import ErrorResponse from '../helpers/errorResponse.js';
import { bufferToDataUri } from '../middlewares/multer.js';

const createUserDog = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length < 3) {
    return next(new ErrorResponse('Please upload at least 3 dog images', 400));
  }
  const dogImages = req.files.filter((file) => file.fieldname === 'dogImages');
  // check for existing dogs
  const existingDog = await Dog.findOne({
    name: req.body.name,
    gender: req.body.gender,
    breed: req.body.breed,
    age: req.body.age,
    owner: req.user._id,
    relationship_preference: req.body.relationship_preference,
  });
  if (existingDog) {
    return next(new ErrorResponse('Dog already exists', 400));
  }
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
  const newDog = await Dog.create(dogData);
  // Fetch the updated user with the populated 'dogs' field
  const updatedUser = await User.findById(req.user._id).populate('dogs');
  res.status(201).json({
    success: true,
    data: newDog,
    userWithDogs: updatedUser,
    message: 'Dog created successfully',
  });
});

const getDogs = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    ...res.advancedResults,
    message: 'Dog(s) retrieved successfully',
  });
});

const getDog = asyncHandler(async (req, res, next) => {
  const dog = await Dog.findById(req.params.id);
  if (!dog) {
    return next(new ErrorResponse('Dog not found', 404));
  }
  res.status(200).json({
    success: true,
    data: dog,
    message: 'Dog fetched successfully',
  });
});

const getUsersDogs = asyncHandler(async (req, res, next) => {
  const dogs = await Dog.find({ owner: req.params.id });
  res.status(200).json({
    success: true,
    data: dogs,
    message: 'Dogs fetched successfully',
  });
});

const deleteDog = asyncHandler(async (req, res, next) => {
  const dog = await Dog.findById(req.params.id);
  if (!dog) {
    return next(new ErrorResponse('Dog not found', 404));
  }
  if (
    dog.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('You are not authorized to delete this dog', 401),
    );
  }
  await dog.deleteOne();
  res.status(200).json({
    success: true,
    data: {},
    message: 'Dog deleted successfully',
  });
});

export { createUserDog, getDogs, getDog, deleteDog, getUsersDogs };
