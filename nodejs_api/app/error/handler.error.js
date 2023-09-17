/**
 * Handles a cast error and sends an appropriate response.
 *
 * @param {Object} res - The response object.
 * @param {Error} err - The cast error.
 * @return {Object} - The response object.
 */
const handleCastError = (res, err) => {
  const message = `${err.path} ${err.value} invalide.`;
  const status = err.status ?? 500;

  return res.status(status).json({ message });
};

/**
 * Handles a MongoDB error and sends a JSON response with an error message and status code.
 *
 * @param {Object} res - The response object.
 * @param {Object} err - The MongoDB error object.
 * @return {Object} - The JSON response with an error message.
 */
const handleMongoError = (res, err) => {
  const { status } = err;
  const message = 'An issue is running, please wait ';
  return res.status(status).json({ message });
};

/**
 * Handles validation errors and sends a response with error messages.
 *
 * @param {Object} res - The response object.
 * @param {Object} err - The error object containing validation errors.
 * @return {Object} - The JSON response object with error message.
 */
const handleValidationError = (res, err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalide data : ${errors.join('. ')}`;
  return res.status(400).json({ message });
};

const handleTokenError = (res) => {
  const message = 'Invalide connexion.Please reconnect ';
  return res.status(401).json({ message });
};

/**
 * Handles errors that occur in the application.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 * @return {Object} The response object.
 */

const errorHandler = (err, req, res) => {
  const { message } = err;
  const status = err.status ?? 500;

  if (err.name === 'CastError') {
    handleCastError(res, err);
  }
  if (err.name === 'MongoError') {
    handleMongoError(res, err);
  }

  if (err.name === 'ValidationError') {
    handleValidationError(res, err);
  }

  if (err.name === 'JsonWebTokenError') {
    handleTokenError(res);
  }

  return res.status(status).json({ message });
};
export default errorHandler;
