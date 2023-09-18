import AppError from '../error/app.error.js';

/**
 * Validates the value of a property in the request object using a schema.
 *
 * @param {string} prop - The name of the property to validate in the request object.
 * @param {Joi.Schema} schema - The schema used to validate the property value.
 * @return {function} A middleware function whose check if the given data have all require field.
 */
const validator = (prop, schema) => async (req, _, next) => {
  try {
    await schema.validateAsync(req[prop]);
    next();
  } catch (error) {
    next(new AppError(400, error.details[0].message));
  }
};

export default validator;
