import { Router } from 'express';
import passController from '../controllers/pass.controller.js';
import AppError from '../error/app.error.js';
import errorWrapper from '../error/wrapper.error.js';
import validator from '../validation/validator.validation.js';
import passValidator from '../validation/schema/pass.schema.js';
import authController from '../controllers/auth.controller.js';

const passRouter = Router();

passRouter.route('/')
  .get(errorWrapper(passController.getAllPass))
  .post(authController.isAdmin, validator('body', passValidator), errorWrapper(passController.addPass));
passRouter.route('/:id')
  .get(authController.isOwner, errorWrapper(passController.getOne))
  .patch(authController.isOwner, validator('body', passValidator), errorWrapper(passController.updatePass))
  .delete(authController.isOwner, errorWrapper(passController.deletePass));

passRouter.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '));
});

export default passRouter;
