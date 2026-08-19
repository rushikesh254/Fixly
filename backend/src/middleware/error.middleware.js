const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.statusCode && err.message
      ? err.message
      : "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
