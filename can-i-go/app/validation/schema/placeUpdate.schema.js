import Joi from 'joi';

const placeUpdate = Joi.object({
  adress: Joi.string(),
  ageRequire: Joi.number(),
  phoneNumber: Joi.string(),
  passLevelId: Joi.array().items(Joi.string()),
  ownerId: Joi.string(),
});

export default placeUpdate;
