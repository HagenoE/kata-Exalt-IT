import { Router } from 'express';
import passController from '../controllers/pass.controller.js';
import AppError from '../error/app.error.js';
import errorWrapper from '../error/wrapper.error.js';

const passRouter = Router();

passRouter.route('/')
  .get(errorWrapper(passController.getAllPass))
  .post(errorWrapper(passController.addPass));
passRouter.route('/:id')
  .get(errorWrapper(passController.getOne))
  .patch(errorWrapper(passController.updatePass))
  .delete(errorWrapper(passController.deletePass));

passRouter.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '));
});

export default passRouter;