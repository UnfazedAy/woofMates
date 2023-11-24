import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js';

const userRouter = new Router();

userRouter
  .route('/')
  .get(getAllUsers);

userRouter
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default userRouter;
