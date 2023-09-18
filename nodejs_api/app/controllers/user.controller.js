import AppError from '../error/app.error.js';
import User from '../models/user.model.js';
import Place from '../models/place.model.js';
import { getTokenInformation } from './auth.controller.js';

const userController = {
  getAllUser: async (req, res) => {
    const user = await User.find();

    return res.status(200).json({ data: user });
  },
  addUser: async (req, res) => {
    const newUser = new User(req.body);

    await newUser.save();
    res.status(201).json({ data: newUser });
  },
  findOneUser: async (req, res, next) => {
    const { id } = req.params;

    const findUser = await User.findById(id);

    if (!findUser) {
      return next(new AppError('No match found', 400));
    }

    return res.status(200).json({ data: findUser });
  },
  updateUser: async (req, res, next) => {
    const { id } = req.params;

    const oldUser = await User.findByIdAndUpdate(id, req.body);

    if (!oldUser) {
      return next(new AppError(404, 'No match found'));
    }

    const updatedUser = await User.findById(id);

    return res.status(201).json({ data: updatedUser });
  },
  deleteUser: async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id, req.body);

    if (!user) {
      return next(new AppError(404, 'No match found'));
    }

    return res.sendStatus(204);
  },
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
