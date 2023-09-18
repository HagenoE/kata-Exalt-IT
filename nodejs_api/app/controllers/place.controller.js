import AppError from '../error/app.error.js';
import Place from '../models/place.model.js';
import User from '../models/user.model.js';
import { getTokenInformation } from './auth.controller.js';

const placeController = {
  /**
   * Retrieves all places.
   *
   * @param {Object} _ - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object with the retrieved places.
   */
  getAllPlace: async (_, res) => {
    const place = await Place.find();

    return res.status(200).json({ data: place });
  },

  /**
   * Adds a new place to the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The JSON response containing the newly added place data.
   */
  addNewPlace: async (req, res) => {
    const newPlace = new Place(req.body);

    await newPlace.save();

    return res.status(201).json({ data: newPlace });
  },

  /**
   * Retrieves a single place by its ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {Object} The place object.
   */
  getOnePlace: async (req, res, next) => {
    const { id } = req.body;
    const placeFound = await Place.findById(id);

    if (!placeFound) {
      return next(new AppError(404, 'No place found'));
    }

    return res.status(200).json({ data: placeFound });
  },

  /**
   * Update a place.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {Object} The updated place.
   */
  updatePlace: async (req, res, next) => {
    const { id } = req.params;

    const oldPlace = await Place.findByIdAndUpdate(id, { ...req.body });

    if (!oldPlace) {
      return next(new AppError(404, 'No place found'));
    }

    const placeUpdate = await Place.findById(id);
    return res.status(201).json({ data: placeUpdate });
  },

  /**
   * Delete a place by its ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @return {Number} The HTTP status code 204.
   */
  deletePlace: async (req, res, next) => {
    const { id } = req.params;

    const place = await Place.findByIdAndRemove(id);
    if (!place) {
      return next(new AppError(404, 'No place found'));
    }

    return res.sendStatus(204);
  },

  /**
   * Authorizes a user to access a place.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @return {Object} The response object say if the user has access to the place or not.
   */
  authorizeForUser: async (req, res, next) => {
    const { id } = req.params;

    const place = await Place.findById(id);
    if (!place) {
      return next(new AppError(404, 'No place found'));
    }

    const decode = getTokenInformation(req, next);
    const user = await User.findById(decode.id);

    if (
      !(place.passLevelId.includes(user.passLevelId))
      || !(place.ageRequire <= user.age)
    ) {
      return res.status(200).json({ message: 'User could not have acces to this place' });
    }
    return res.status(200).json({ message: 'User could acces to this place' });
  },
};

export default placeController;
