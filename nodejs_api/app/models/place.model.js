import mongoose from 'mongoose';

const placeSchema = mongoose.Schema({
  adress: {
    type: String,
    required: [true, 'must have an adress'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'must have an adress'],
    unique: true,
  },
  passLevelRequire: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Pass',
    required: [true, 'must have an adress'],
  },
  ageRequire: {
    type: Number,
    required: [true, 'must have an age minimal'],
  },
});

const Place = mongoose.model('Place', placeSchema, 'place');

export default Place;
