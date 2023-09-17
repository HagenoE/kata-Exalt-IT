import { Router } from 'express';
import placeController from '../controllers/place.controller.js';
import errorWrapper from '../error/wrapper.error.js';

const placeRouter = Router();
// TODO: add joi validator for put and post route
placeRouter.route('/')
  .get(placeController.getAllPlace)
  .post(errorWrapper(placeController.addNewPlace));

placeRouter.route('/:id')
  .get(errorWrapper(placeController.getOnePlace))
  .put(errorWrapper(placeController.updatePlace))
  .delete(errorWrapper(placeController.deletePlace));

export default placeRouter;
