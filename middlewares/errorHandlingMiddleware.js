/**
 * @desc    send error for development
 */
const sendErrorForDev = (err, res, statusCode, message) =>
  res
    .status(statusCode)
    .json({ statusCode, message, error: err, stack: err.stack });

/**
 * @desc    send error for production
 */
const sendErrorForProd = (err, res, statusCode, message) =>
  res.status(statusCode).json({ statusCode, message });

/**
 * @desc    global error handling middleware
 */
const globalErrorHandlingMiddleware = (err, req, res, next) => {
  let statusCode = (err.statusCode === 200 ? 500 : err.statusCode) || 500;
  let message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res, statusCode, message);
  } else {
    // invalid token
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token, please log in again...";
    }
    // expired token
    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired, please log in again...";
    }
    sendErrorForProd(err, res, statusCode, message);
  }
};

module.exports = globalErrorHandlingMiddleware;
