import Joi from 'joi';

const placeCreate = Joi.object({
  adress: Joi.string().required(),
  ageRequire: Joi.number().required(),
  phoneNumber: Joi.string(),
  passLevelId: Joi.array().items(Joi.string()).required(),
  ownerId: Joi.string().required(),

});

export default placeCreate;
