import { Router } from 'express';
import placeController from '../controllers/place.controller.js';
import errorWrapper from '../error/wrapper.error.js';
import AppError from '../error/app.error.js';
import validator from '../validation/validator.validation.js';
import placeCreate from '../validation/schema/placeCreate.schema.js';
import placeUpdate from '../validation/schema/placeUpdate.schema.js';

const placeRouter = Router();
placeRouter.route('/')
  .get(placeController.getAllPlace)
  .post(validator('body', placeCreate), errorWrapper(placeController.addNewPlace));

placeRouter.route('/:id')
  .get(errorWrapper(placeController.getOnePlace))
  .put(validator('body', placeUpdate), errorWrapper(placeController.updatePlace))
  .delete(errorWrapper(placeController.deletePlace));

placeRouter.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '));
});

export default placeRouter;
