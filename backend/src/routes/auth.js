import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.js';

const authRouter = new Router();

authRouter
  .route('/register')
  .post(register);

authRouter
  .route('/login')
  .post(login);

authRouter
  .route('/forgotpassword')
  .post(forgotPassword);

authRouter
  .route('/resetpassword/:resettoken')
  .put(resetPassword);

export default authRouter;
