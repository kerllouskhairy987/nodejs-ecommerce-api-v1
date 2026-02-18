const { check } = require("express-validator");
const validateMiddleware = require("../../middlewares/categoryMiddleware");

// @desc   validators for create brand routes
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters")
    .trim(),
  validateMiddleware,
];

// @desc    validators for get brand routes
exports.getBrandValidator = [
  // 1- Rules
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  // 2- middleware ==> catches errors from rules if exists
  validateMiddleware,
];

// @desc    validators for update brand routes
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters")
    .trim(),
  validateMiddleware,
];

// @desc    validators for delete brand routes
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validateMiddleware,
];
