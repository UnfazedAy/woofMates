/* eslint-disable camelcase */
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Dog from '../models/Dog.js';
import uploader from '../helpers/cloudinary.js';
import ErrorResponse from '../helpers/errorResponse.js';
import { bufferToDataUri } from '../middlewares/multer.js';

const createUserDog = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length < 3) {
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
      dogImage1: dogImagesUrls[0],
      dogImage2: dogImagesUrls[1],
      dogImage3: dogImagesUrls[2],
    },
    relationship_preference: req.body.relationship_preference,
  };
  const newDog = await Dog.create(dogData);
  // Fetch the updated user with the populated 'dogs' field
  const updatedUser = await User.findById(req.user._id).select(
    'username email',
  );
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
  const dogs = await Dog.find({ owner: req.params.userId });
  if (!dogs) {
    return next(new ErrorResponse('User has no dogs', 404));
  }
  return res.status(200).json({
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

const updateDog = asyncHandler(async (req, res, next) => {
  const allowedFieldsToUpdate = [
    'name',
    'gender',
    'breed',
    'age',
    'bio',
    'dogImage1',
    'dogImage2',
    'dogImage3',
    'relationship_preference',
  ];
  const updates = req.body;
  const { id } = req.params;
  const updatedDog = await Dog.findById(id);
  // Make sure dog exists
  if (!updatedDog) {
    return next(new ErrorResponse('Dog not found', 404));
  }
  // Make sure user is updating their own dog
  if (
    updatedDog.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('You are not authorized to update this dog', 401),
    );
  }
  // Filter and update allowed fields
  const filteredUpdates = Object.keys(updates).filter((update) =>
    allowedFieldsToUpdate.includes(update),
  );
  filteredUpdates.forEach((update) => {
    updatedDog[update] = updates[update];
  });

  // Handle image update
  if (req.files) {
    const dogImages = req.files.filter((file) =>
      ['dogImage1', 'dogImage2', 'dogImage3'].includes(file.fieldname),
    );
    if (dogImages.length > 0) {
      const dogImage = dogImages[0];
      const { mimetype, buffer } = dogImage;
      const fieldname = dogImage.fieldname;
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
      updatedDog.dogImages[fieldname] = imageUrl;
    }
  }
  await updatedDog.save();
  res.status(200).json({
    success: true,
    data: updatedDog,
    message: 'Dog updated successfully',
  });
});

const getDogsByDistance = asyncHandler(async (req, res, next) => {
  const { distance, lat, lng } = req.params;
  const dogs = await Dog.find({
    location: {
      $near: {
        $maxDistance: distance,
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    },
  });
  if (!dogs) {
    return next(new ErrorResponse('No dogs found', 404));
  }
  res.status(200).json({
    success: true,
    data: dogs,
    message: 'Dogs fetched successfully',
  });
});

const filterDogsMatch = asyncHandler(async (req, res, next) => {
  const {
    breed,
    age,
    city,
    state,
    relationship_preference,
    gender,
  } = req.query;

  const userId = req.user._id;

  // Checks if no filters were provided and if not,
  // returns all dogs except the user's dogs
  if (
    !breed &&
    !age &&
    !city &&
    !state &&
    !relationship_preference &&
    !gender
  ) {
    const dogs = await Dog.find({ owner: { $ne: userId } });
    if (!dogs || dogs.length === 0) {
      return next(new ErrorResponse('No dogs found', 404));
    }
  }

  const query = { owner: { $ne: userId } };

  // Build the query dynamically based on the available filters
  Object.entries({
    breed,
    age,
    city,
    state,
    relationship_preference,
    gender,
  }).forEach(([key, value]) => {
    if (value !== undefined) {
      query[key] = value;
    }
  });

  if (relationship_preference === 'Breeding Partner' && gender) {
    query.gender = { $ne: gender };
  }

  const dogs = await Dog.find(query);
  if (!dogs || dogs.length === 0) {
    return next(new ErrorResponse('No dogs found', 404));
  }

  res.status(200).json({
    success: true,
    data: dogs,
    message: 'Dogs matches fetched successfully',
  });
});


export {
  createUserDog,
  getDogs,
  getDog,
  deleteDog,
  getUsersDogs,
  updateDog,
  getDogsByDistance,
  filterDogsMatch,
};
