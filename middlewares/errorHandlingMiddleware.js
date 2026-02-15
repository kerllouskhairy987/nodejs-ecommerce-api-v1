const globalErrorHandlingMiddleware = (err, req, res, next) => {
  const statusCode = (err.statusCode === 200 ? 500 : err.statusCode) || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    statusCode,
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = globalErrorHandlingMiddleware;
