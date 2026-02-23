const { check } = require("express-validator");
const slugify = require("slugify");
const validateMiddleware = require("../../middlewares/categoryMiddleware");

// @desc   validators for create sub category routes
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("SubCategory name must be between 2 and 100 characters"),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to main category")
    .isMongoId()
    .withMessage("Invalid category ID format"),

  validateMiddleware,
];

// @desc   validators for get sub category by id route
exports.getSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid sub category ID format")
    .notEmpty()
    .withMessage("Sub category ID is required"),

  validateMiddleware,
];

// @desc    validators for update sub category by id route
exports.updateSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid sub category ID format")
    .notEmpty()
    .withMessage("Sub category ID is required"),
  check("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("SubCategory name must be between 2 and 100 characters")
    // TODO: update slug if name is updated
    .custom((val, { req }) => {
      if (!val) return false;
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .optional()
    .notEmpty()
    .withMessage("SubCategory must belong to main category")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validateMiddleware,
];

// @desc    validators for delete sub category by id route
exports.deleteSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid sub category ID format")
    .notEmpty()
    .withMessage("Sub category ID is required"),
  validateMiddleware,
];
