// Function: Multer middleware for file upload

import multer from 'multer';
import DatauriParser from 'datauri/parser.js';

const parser = new DatauriParser();
const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
}).any(); // Use .any() for multiple files

const bufferToDataUri = (fileFormat, buffer) => {
  return parser.format(fileFormat, buffer);
};

export { upload, bufferToDataUri };
