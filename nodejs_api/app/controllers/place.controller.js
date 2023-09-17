import AppError from '../error/app.error.js';
import Place from '../models/place.model.js';

const placeController = {

  getAllPlace: async (_, res) => {
    const place = await Place.find();

    return res.status(200).json({ data: place });
  },
  addNewPlace: async (req, res) => {
    const newPlace = new Place(req.body);
    await newPlace.save();

    return res.status(201).json({ data: newPlace });
  },
  getOnePlace: async (req, res, next) => {
    const { id } = req.body;
    const placeFound = await Place.findById(id);

    if (!placeFound) {
      return next(new AppError(404, 'No place found'));
    }

    return res.status(200).json({ data: placeFound });
  },
  updatePlace: async (req, res, next) => {
    const { id } = req.params;

    const oldPlace = await Place.findByIdAndUpdate(id, { ...req.body });

    if (!oldPlace) {
      return next(new AppError(404, 'No place found'));
    }

    const placeUpdate = await Place.findById(id);
    return res.status(201).json({ data: placeUpdate });
  },
  deletePlace: async (req, res, next) => {
    const { id } = req.params;

    const place = await Place.findByIdAndRemove(id);
    if (!place) {
      return next(new AppError(404, 'No place found'));
    }

    return res.sendStatus(204);
  },

};

export default placeController;
