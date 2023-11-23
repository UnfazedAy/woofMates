import { Router } from 'express';
import { upload } from '../middlewares/multer.js';
import { protect } from '../middlewares/auth.js';
import {
  getAllUsers,
  profile,
  updateAvatar,
} from '../controllers/users.js';

const userRouter = new Router();

userRouter
  .route('/')
  .get(getAllUsers);

userRouter
  .route('/profile')
  .get(protect, profile);

// Add a new route for updating the avatar
userRouter
  .route('/:id/avatar')
  .put(upload, updateAvatar);

export default userRouter;
