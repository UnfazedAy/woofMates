/* eslint-disable no-invalid-this */
import mongoose from 'mongoose';
import geocoder from '../helpers/geocoder.js';
import logger from '../helpers/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import keys from '../config/keys.js';

const { JWT_SECRET, JWT_EXPIRES_IN } = keys;

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please add a valid email',
      ],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Please add a password'],
      select: false, // Hide password from query results
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default:
        'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
    },
    bio: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        // required: true,
      },
      coordinates: {
        type: [Number],
        // required: true,
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    dogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Geocoder and create location feild
UserSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].latitude, loc[0].longitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

// Cascade delete dogs when a user is deleted
UserSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function(next) {
    logger.info(`Dogs being removed from user ${this._id}`);
    await this.model('Dog').deleteMany({ user: this._id });
    next();
  },
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in DB
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};

// // Reverse populate with virtuals
// UserSchema.virtual("dogs", {
//   ref: "Dog",
//   localField: "_id",
//   foreignField: "user",
//   justOne: false,
//   options: { sort: { createdAt: -1 } },
// });

export default mongoose.model('User', UserSchema);
