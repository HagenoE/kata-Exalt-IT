import AppError from '../error/app.error.js';
import User from '../models/user.model.js';
import Place from '../models/place.model.js';
import { getTokenInformation } from './auth.controller.js';

const userController = {

  /**
   * Retrieves all users.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The user data.
   */
  getAllUser: async (req, res) => {
    const user = await User.find();

    return res.status(200).json({ data: user });
  },

  /**
   * Adds a new user to the database.
   *
   * @param {Object} req - The request object containing the user data.
   * @param {Object} res - The response object for sending the response.
   * @return {Object} The newly created user data.
   */
  addUser: async (req, res) => {
    const newUser = new User(req.body);

    await newUser.save();
    res.status(201).json({ data: newUser });
  },

  /**
   * Find a user by ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @return {Object} The JSON response with the user data.
   */
  findOneUser: async (req, res, next) => {
    const { id } = req.params;

    const findUser = await User.findById(id);

    if (!findUser) {
      return next(new AppError('No user found', 400));
    }

    return res.status(200).json({ data: findUser });
  },

  /**
   * Updates a user in the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   * @return {object} The updated user object.
   */
  updateUser: async (req, res, next) => {
    const { id } = req.params;

    const oldUser = await User.findByIdAndUpdate(id, req.body);

    if (!oldUser) {
      return next(new AppError(404, 'No user found'));
    }

    const updatedUser = await User.findById(id);

    return res.status(201).json({ data: updatedUser });
  },

  /**
   * Deletes a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {undefined} Returns a 204 status code if successful.
   */
  deleteUser: async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id, req.body);

    if (!user) {
      return next(new AppError(404, 'No user found'));
    }

    return res.sendStatus(204);
  },

  /**
   * Retrieves the places that a user can access based on their pass level.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @param {Function} next - the next function
   * @return {Object} the response object containing the places that the user can access
   */
  placeCanAccess: async (req, res, next) => {
    const decode = getTokenInformation(req, next);
    const user = await User.findById(decode.id);
    const places = await Place.find();

    const placeAuthorize = places.map((place) => {
      const isRightPlace = place.passLevelId.includes(user.passLevelId);
      if (!isRightPlace) {
        return false;
      }

      return place;
    });

    if (placeAuthorize.length === 0) {
      return res.status(200).json({ message: 'No place found' });
    }

    return res.status(200).json({ data: placeAuthorize });
  },
};

export default userController;
