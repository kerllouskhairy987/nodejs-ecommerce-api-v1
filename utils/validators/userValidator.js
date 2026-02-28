const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validateMiddleware = require("../../middlewares/categoryMiddleware");
const User = require("../../models/userModel");
const ApiError = require("../apiError");

/**
 * @desc   validators for create user routes
 */
exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("name must be at most 32 characters long")
    .trim()
    // TODO: update slugify if name updated
    .custom((val, { req }) => {
      if (!val) return false;
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is invalid")
    .toLowerCase()
    .trim()
    // TODO: check if email exists in DB
    .custom(async (val) => {
      const email = await User.findOne({ email: val });
      if (email) throw new Error("email already exists");
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("phone number must belong to Egypt or Saudi Arabia"),

  check("profileImg").optional(),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    )
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new ApiError(
          "password and passwordConfirm must be the same",
          400,
        );
      }
      return true; // to continue
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required"),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("role must be user or admin")
    .default("user"),

  check("active")
    .optional()
    .isBoolean()
    .withMessage("active must be true or false")
    .default(true),

  validateMiddleware,
];

// @desc   validators for get user routes
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validateMiddleware,
];

/**
 * @desc    validators for update user routes
 */
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),

  check("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("name must be between 3 and 32 characters long")
    .trim()
    // TODO: update slugify if name updated
    .custom((val, { req }) => {
      if (!val) return false;
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is invalid")
    .toLowerCase()
    .trim(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("phone number must belong to Egypt or Saudi Arabia"),

  check("profileImg").optional(),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("role must be user or admin")
    .default("user"),

  check("active")
    .optional()
    .isBoolean()
    .withMessage("active must be true or false")
    .default(true),

  validateMiddleware,
];

/**
 * @desc    validator for update user password
 */
exports.updateUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),

  // check("currentPassword")
  //   .notEmpty()
  //   .withMessage("current password is required")
  //   .custom(async (currentPassword, { req }) => {
  //     const user = await User.findById(req.params.id);
  //     if (!user)
  //       throw new ApiError(`no user found for this id ${req.params.id}`, 404);

  //     const hash = user.password;
  //     const isCorrectPassword = await bcrypt.compare(currentPassword, hash);
  //     if (!isCorrectPassword)
  //       throw new ApiError("current password is incorrect", 400);
  //   }),

  check("password")
    .notEmpty()
    .withMessage("new password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    )
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm)
        throw new ApiError(
          "password and password confirm must be the same",
          400,
        );

      return true; // to continue
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required"),

  validateMiddleware,
];

/**
 * @desc     validators for delete user routes
 */
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validateMiddleware,
];
