import { Router } from 'express';
import { register, login } from '../controllers/auth.js';

const authRouter = new Router();

authRouter
  .route('/register')
  .post(register);

authRouter
  .route('/login')
  .post(login);

export default authRouter;
