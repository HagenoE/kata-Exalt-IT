import mongoose from 'mongoose';

const passSchema = mongoose.Schema({

  passLevel: {
    type: String,
    required: [true, 'must have a pass level'],
    unique: true
  },
  createdAt: {
    type: Date,
    default: function () {
      return Date.now()
    }
  },
  updatedAt: {
    type: Date,
    default: function () {
      return null;
    }
  }
});

const Pass = mongoose.model('Pass', passSchema, 'pass');
export default Pass;