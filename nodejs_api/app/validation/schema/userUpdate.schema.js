import Joi from 'joi';

const userUpdate = Joi.object({
  passLevelId: Joi.string().required,
  age: Joi.number(),
  email: Joi.string().email(),
  password: Joi.string().min(8).pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/),
  passwordConfirm: Joi.string().min(8).pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/),
  firstName: Joi.string().pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/),
  lastName: Joi.string().pattern(/^[a-zA-ZÀ-ÿ0-9-]+$/),
  phoneNumber: Joi.string(),
  adress: Joi.string(),
});

export default userUpdate;
