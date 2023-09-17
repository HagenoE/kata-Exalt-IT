import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'must have an adress first name'],
    unique: true
  },
  lastName: {
    type: String,
    required: [true, 'must have a lastName'],
  },
  Age: {
    type: Number,
    required: [true, 'must have an age'],
  },
  phoneNumber: {
    type: Number,
    required: [true, 'must have an adress'],
    unique: true
  },
  adress: {
    type: String,
    required: [true, 'must have an adress'],
    unique: true
  },
  passLevelId: String
})

const User = mongoose.model('User', userSchema, 'user');

export default User;