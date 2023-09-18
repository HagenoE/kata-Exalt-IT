import Joi from 'joi';

const userCreate = Joi.object({
  passLevelId: Joi.string().required(),
  age: Joi.number().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/).required(),
  passwordConfirm: Joi.string().min(4).pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/).required(),
  firstName: Joi.string().pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/),
  lastName: Joi.string().pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/),
  phoneNumber: Joi.string(),
  adress: Joi.string(),
  role: Joi.string(),
});

export default userCreate;
