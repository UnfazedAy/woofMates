// Cloudinary configuration to upload images

import keys from '../config/keys.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';
import axios from 'axios';

const { CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_NAME } =
  keys;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

console.log('Cloudinary Cloud Name:', CLOUDINARY_NAME);

const uploader = async (file, folderName, userName, feildName) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      folder: `${folderName}/${userName}_${feildName}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'],
    });
    return res.secure_url;
  } catch (err) {
    logger.error('Cloudinary upload error:', err.message);
  }
};

export default uploader;

// Test function with updated file content handling
const testUploader = async () => {
  try {
    const fileUrl = 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=';

    // Fetch the image content as a Buffer using axios
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });

    // Convert the fetched image content into a Buffer
    const fileBuffer = Buffer.from(response.data);

    const folderName = 'woofMate_users';
    const userName = 'ayomidesoniyi@gmail.com';
    const fieldName = 'avatar';

    // Upload the fileBuffer using the uploader function
    const imageUrl = await uploader(
      fileBuffer, folderName, userName, fieldName,
    );
    console.log('Uploaded image URL:', imageUrl);
  } catch (err) {
    console.log(err);
  }
};

// Run the test function
testUploader();
