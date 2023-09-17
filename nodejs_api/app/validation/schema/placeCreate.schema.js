import Joi from 'joi';

const placeCreate = Joi.object({
  adress: Joi.string().required,
  age: Joi.string().required,
  phoneNumber: Joi.string(),
  passLevel: Joi.string().required,
  owner: Joi.string().required,

});

export default placeCreate;
