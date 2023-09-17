import { Router } from 'express';
import errorWapper from '../error/wrapper.error.js';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const userRouter = Router();

// auth route
userRouter.post('/signup', errorWapper(authController.signUp));
userRouter.post('/login', errorWapper(authController.login));

//  Method for password for the current user
userRouter.post('/forgotPassword', errorWapper(authController.forgotPassword));
userRouter.patch('/resetPassword/:token', errorWapper(authController.resetPassword));
userRouter.patch('/updatePassword', authController.isLogged, errorWapper(authController.updatePassword));

userRouter.route('/')
  .get(authController.isAdmin, errorWapper(userController.getAllUser))
  .post(authController.isAdmin, errorWapper(userController.addUser));

userRouter.route('/:id')
  .get(authController.isAdmin, errorWapper(userController.findOneUser))
  .put(authController.isAdmin, errorWapper(userController.updateUser))
  .delete(authController.isAdmin, errorWapper(userController.deleteUser));

export default userRouter;
