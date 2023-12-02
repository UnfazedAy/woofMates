import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
import {
  createUserDog,
} from '../controllers/dogs.js';

const dogRouter = new Router();

dogRouter
  .route('/')
  .post(upload, protect, createUserDog);

export default dogRouter;
