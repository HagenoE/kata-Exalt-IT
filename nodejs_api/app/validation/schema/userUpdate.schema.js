import Joi from 'joi';

const userUpdate = Joi.object({
  passLevel: Joi.string().required,
  age: Joi.number(),
  email: Joi.string().email(),
  password: Joi.string(),
  passwordConfirm: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string(),
  adress: Joi.string(),
});

export default userUpdate;
