import mongoose from 'mongoose';

const placeSchema = mongoose.Schema({
  adress: {
    type: String,
    required: [true, 'must have an adress'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  passLevelId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Pass',
    required: [true, 'must have a pass level'],
  },
  ageRequire: {
    type: Number,
    required: [true, 'must have an age minimal'],
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'must have a owner'],
  },
});

const Place = mongoose.model('Place', placeSchema, 'place');

export default Place;
