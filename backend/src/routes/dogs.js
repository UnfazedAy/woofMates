import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
import Dog from '../models/Dog.js';
import advancedResults from '../middlewares/advancedResults.js';
import {
  createUserDog,
  getDog,
  getDogs,
  deleteDog,
  getUsersDogs,
} from '../controllers/dogs.js';

const dogRouter = new Router();

dogRouter
  .route('/')
  .get(advancedResults(Dog), getDogs)
  .post(upload, protect, createUserDog);

dogRouter
  .route('/:id')
  .get(getDog)
  .delete(protect, deleteDog);

dogRouter
  .route('/user/:id')
  .get(getUsersDogs);

export default dogRouter;
