import mongoose from 'mongoose';
import { relationshipsEnums, breedsEnum, gendersEnum } from '../helpers/enums';

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
    images: {
      type: [String],
      default: [],
      min: [3, 'Please add at least 3 images'],
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
