import { Router } from 'express';
import { upload } from '../middlewares/multer.js';
import { protect } from '../middlewares/auth.js';
import { userProfile, updateAvatar } from '../controllers/profile.js';

const profileRouter = new Router();

profileRouter
  .route('/')
  .get(protect, userProfile);

// Add a new route for updating the avatar
profileRouter
  .route('/avatar')
  .put(upload, protect, updateAvatar);

export default profileRouter;
