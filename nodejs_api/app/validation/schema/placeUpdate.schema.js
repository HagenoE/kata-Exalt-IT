import Joi from 'joi';

const placeUpdate = Joi.object({
  adress: Joi.string(),
  age: Joi.string(),
  phoneNumber: Joi.string(),
  passLevel: Joi.string(),
  owner: Joi.string(),
});

export default placeUpdate;
