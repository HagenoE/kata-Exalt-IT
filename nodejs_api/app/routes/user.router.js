import { Router } from 'express';
import errorWapper from '../error/wrapper.error.js';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
import AppError from '../error/app.error.js';
import validator from '../validation/validator.validation.js';
import userCreate from '../validation/schema/userCreate.schema.js';
import userUpdate from '../validation/schema/userUpdate.schema.js';

const userRouter = Router();

// auth route
userRouter.post('/signup', validator('body', userCreate), errorWapper(authController.signUp));
userRouter.post('/login', errorWapper(authController.login));

//  Method for password for the current user
userRouter.post('/forgotPassword', errorWapper(authController.forgotPassword));
userRouter.patch('/resetPassword/:token', errorWapper(authController.resetPassword));
userRouter.patch('/updatePassword', authController.isLogged, errorWapper(authController.updatePassword));

userRouter.route('/')
  .get(authController.isAdmin, errorWapper(userController.getAllUser))
  .post(authController.isAdmin, validator('body', userCreate), errorWapper(userController.addUser));

userRouter.get('/places', userController.placeCanAccess);

userRouter.route('/:id')
  .get(authController.isOwner, errorWapper(userController.findOneUser))
  .put(authController.isOwner, validator('body', userUpdate), errorWapper(userController.updateUser))
  .delete(authController.isAdmin, errorWapper(userController.deleteUser));

userRouter.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '));
});

export default userRouter;
