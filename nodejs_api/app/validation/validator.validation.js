import AppError from '../error/app.error.js';

const validator = (prop, schema) => async (req, _, next) => {
  try {
    await schema.validationAsync(req[prop]);
    next();
  } catch (error) {
    next(new AppError(400, error.details[0].message));
  }
};

export default validator;
