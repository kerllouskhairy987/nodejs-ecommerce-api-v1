const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const ApiError = require("../apiError");
const validateMiddleware = require("../../middlewares/categoryMiddleware");
const CouponModel = require("../../models/couponModel");

/**
 * @desc     create coupon validator
 * @route    POST /api/v1/coupons
 * @access   private / admin - manager
 */
exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("coupon name is required")
    .trim()
    .customSanitizer((val) => slugify(val, { replacement: "_" }).toUpperCase())
    .custom(async (val) => {
      const coupon = await CouponModel.findOne({ name: val });

      if (coupon) {
        throw new ApiError("the coupon name must be unique", 400);
      }
    }),

  check("expire")
    .notEmpty()
    .withMessage("expire date is required")
    .isDate()
    .withMessage(
      "expire date must be date format, like (YYYY-MM-DD) for example (2022-01-01)",
    ),

  check("discount")
    .notEmpty()
    .withMessage("discount is required")
    .isNumeric()
    .withMessage("discount must be numeric"),

  validateMiddleware,
];

/**
 * @desc     get specific coupon validator
 * @route    POST /api/v1/coupons/:id
 * @access   private / admin - manager
 */
exports.getCouponValidator = [
  check("id").isMongoId().withMessage("invalid mongoId format"),

  validateMiddleware,
];

/**
 * @desc     update specific coupon validator
 * @route    UPDATE /api/v1/coupons/:id
 * @access   private / admin - manager
 */
exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("invalid mongoId format"),

  check("name")
    .optional()
    .trim()
    .customSanitizer((val) => slugify(val, { replacement: "_" }).toUpperCase())
    .custom(async (val) => {
      const coupon = await CouponModel.findOne({ name: val });
      if (coupon) {
        throw new ApiError("the coupon name must be unique", 400);
      }
    }),

  check("expire").optional().isDate().withMessage("expire date must be date"),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("discount must be numeric"),

  validateMiddleware,
];

/**
 * @desc     delete specific coupon validator
 * @route    DELETE /api/v1/coupons/:id
 * @access   private / admin - manager
 */
exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("invalid mongoId format"),

  validateMiddleware,
];
