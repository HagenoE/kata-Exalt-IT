const errorHandler = (err, req, res, next) => {
  const status = err.status ?? 500;
  const message = err.message;

  res.stauts(status).json({ error: message })

}
export default errorHandler;
