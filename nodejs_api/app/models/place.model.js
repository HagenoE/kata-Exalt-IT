import mongoose from 'mongoose';

const placeSchema = mongoose.Schema({
  adress: {
    type: String,
    required: [true, 'must have an adress'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'must have a phone number'],
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
  owner: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    // required: [true, 'must have a owner'],
  },
});

const Place = mongoose.model('Place', placeSchema, 'place');

export default Place;
