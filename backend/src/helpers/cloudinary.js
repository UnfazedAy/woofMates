// Cloudinary configuration to upload images

import keys from '../config/keys.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';

const { CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_NAME } =
  keys;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const uploader = async (file, folderName, userName, feildName) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      public_id: `${folderName}/${userName}_${feildName}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'],
    });
    return res.secure_url;
  } catch (err) {
    logger.error('Cloudinary upload error:', err.message);
  }
};

export default uploader;
