/* eslint func-names: ["error", "never"] */
import mongoose from 'mongoose';
import '../utils/env.utils.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    default() {
      return null;
    },
  },
  lastName: {
    type: String,
    default() {
      return null;
    },
  },
  age: {
    type: Number,
    required: [true, 'must have an age'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'must have a phone number'],
  },
  adress: {
    type: String,
    default() {
      return null;
    },
  },
  email: {
    type: String,
    required: [true, 'must have an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'must have a password'],
    minlength: 8,
    validate: {
      validator(el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passLevelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pass',
    required: [true, 'must have a pass level'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUND));
  this.passwordConfirm = null;
  return next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

userSchema.methods.correctPassword = async function (candidatePassword, UserPassword) {
  const check = await bcrypt.compare(candidatePassword, UserPassword);
  return check;
};

userSchema.methods.changePasswordAfter = function (tokenTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return tokenTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(31).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema, 'user');

export default User;
