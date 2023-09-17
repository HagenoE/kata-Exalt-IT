import Joi from 'joi';

const passValidator = Joi.object({
  passLevel: Joi.string().required,
});

export default passValidator;
