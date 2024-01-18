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
  updateDog,
  filterDogsMatch,
} from '../controllers/dogs.js';


const dogRouter = new Router({ mergeParams: true });

dogRouter
  .route('/')
  .get(advancedResults(
    Dog, { path: 'owner', select: 'username email' },
  ), getDogs)
  .post(upload, protect, createUserDog);

dogRouter
  .route('/match')
  .get(protect, filterDogsMatch);

dogRouter
  .route('/:id')
  .get(getDog)
  .delete(protect, deleteDog)
  .put(upload, protect, updateDog);

export default dogRouter;
