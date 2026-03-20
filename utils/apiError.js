/**
 * @desc    Api Error Class
 * @access  Public
 * @params  message, statusCode
 * @returns ApiError
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = ApiError;
