import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateAvatar,
} from '../controllers/users.js';

const userRouter = new Router();

userRouter
  .route('/')
  .post(createUser)
  .get(getAllUsers);

userRouter
  .route('/:id')
  .get(getUser);

// Add a new route for updating the avatar
userRouter
  .route('/:id/avatar')
  .put(updateAvatar);

export default userRouter;
