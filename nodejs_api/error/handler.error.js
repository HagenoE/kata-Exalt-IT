const errorHandler = (err, req, res, next) => {
  let message = err.message;
  let status = err.status ?? 500;
  if (err.name === 'CastError') {
    message = 'No match found'
    status = 404
  }
  if (err.name === 'MongoError') {
    message = "An issue is running, please wait "
  }
  if (err.name === 'ValidationError') {
    message = "Validation error";
  }


  return res.status(status).json({ message })

}
export default errorHandler;
