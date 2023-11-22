import { Router } from 'express';
import { upload } from '../middlewares/multer.js';
// import { protect } from '../middlewares/auth.js';
import {
  register,
  getAllUsers,
  profile,
  updateAvatar,
} from '../controllers/auth.js';

const userRouter = new Router();

userRouter
  .route('/')
  .post(register)
  .get(getAllUsers);

userRouter
  .route('/:id')
  .get(profile);

// Add a new route for updating the avatar
userRouter
  .route('/:id/avatar')
  .put(upload, updateAvatar);

export default userRouter;
