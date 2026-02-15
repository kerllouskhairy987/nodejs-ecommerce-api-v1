const { check } = require("express-validator");
const validateMiddleware = require("../../middlewares/categoryMiddleware");

exports.getCategoryValidator = [
  // 1- Rules
  check("id").isMongoId().withMessage("Invalid category ID format"),
  // 2- middleware ==> catches errors from rules if exists
  validateMiddleware,
];
