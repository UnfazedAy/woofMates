import { Router } from 'express';
import User from '../models/User.js';
import { protect } from '../middlewares/auth.js';
import advancedResults from '../middlewares/advancedResults.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js';

const userRouter = new Router();

userRouter
  .route('/')
  .get(advancedResults(User), getAllUsers);

userRouter
  .route('/:id')
  .get(getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default userRouter;
