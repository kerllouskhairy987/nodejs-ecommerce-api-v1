const { validationResult } = require("express-validator");
const apiError = require("../utils/apiError");

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new apiError(`${errors.array()[0].msg}`, 400));
  }
  next();
};

module.exports = validateMiddleware;
