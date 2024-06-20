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
import { getUsersDogs } from '../controllers/dogs.js';


const userRouter = new Router();

// Re-route into other resource routers
userRouter.use('/:userId/dogs', getUsersDogs);

userRouter
  .route('/')
  .get(advancedResults(User), getAllUsers);

userRouter
  .route('/:id')
  .get(getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default userRouter;
