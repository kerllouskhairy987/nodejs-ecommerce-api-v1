const { default: slugify } = require("slugify");
const { check } = require("express-validator");
const validateMiddleware = require("../../middlewares/categoryMiddleware");
const User = require("../../models/userModel");
const ApiError = require("../apiError");

/**
 * @desc   validators for signup
 */
exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters long")
    .trim()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .toLowerCase()
    .trim()
    // TODO: check if email exists in DB
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) throw new ApiError("email already exists", 400);
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
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
    .withMessage("Password confirm is required"),

  validateMiddleware,
];

/**
 * @desc   validators for login
 */
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is invalid")
    .toLowerCase()
    .trim(),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    )
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
    ),

  validateMiddleware,
];
