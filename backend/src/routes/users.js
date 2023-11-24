import { Router } from 'express';
import { getAllUsers } from '../controllers/users.js';

const userRouter = new Router();

userRouter
  .route('/')
  .get(getAllUsers);

export default userRouter;
