import { Router } from 'express';
import User from '../models/User.js';
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
  .put(updateUser)
  .delete(deleteUser);

export default userRouter;
