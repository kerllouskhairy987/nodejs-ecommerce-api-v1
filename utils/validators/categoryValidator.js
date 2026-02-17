const { check } = require("express-validator");
const validateMiddleware = require("../../middlewares/categoryMiddleware");

// @desc   validators for get category routes
exports.getCategoryValidator = [
  // 1- Rules
  check("id").isMongoId().withMessage("Invalid category ID format"),
  // 2- middleware ==> catches errors from rules if exists
  validateMiddleware,
];

// @desc   validators for create category routes
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters")
    .trim(),
  validateMiddleware,
];

// @desc   validators for update category routes
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters")
    .trim(),
  validateMiddleware,
];

// @desc   validators for delete category routes
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validateMiddleware,
];
