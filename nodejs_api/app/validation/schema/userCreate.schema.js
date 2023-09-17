import Joi from 'joi';

const userCreate = Joi.object({
  passLevel: Joi.string().required,
  age: Joi.number().required,
  email: Joi.string().email().required,
  password: Joi.string().required,
  passwordConfirm: Joi.string().required,
});

export default userCreate;
