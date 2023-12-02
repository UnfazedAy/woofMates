import mongoose from 'mongoose';
import {
  relationshipsEnums, breedsEnum, gendersEnum,
} from '../helpers/enums.js';

const DogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    gender: {
      type: String,
      enum: gendersEnum,
      required: [true, 'Please select a gender'],
    },
    breed: {
      type: String,
      enum: breedsEnum,
      required: [true, 'Please add a breed'],
    },
    age: Number,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    dogImages: {
      dogImage_1: {
        type: [String],
        required: [true, 'Please upload at least 3 dog images'],
      },
      dogImage_2: {
        type: [String],
        required: [true, 'Please upload at least 3 dog images'],
      },
      dogImage_3: {
        type: [String],
        required: [true, 'Please upload at least 3 dog images'],
      },
    },
    relationship_preference: {
      type: String,
      enum: relationshipsEnums,
      required: [true, 'Please select a relationship preference'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model('Dog', DogSchema);
