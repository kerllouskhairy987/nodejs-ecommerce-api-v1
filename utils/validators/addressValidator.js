const { check } = require("express-validator");
const validateMiddleware = require("../../middlewares/categoryMiddleware");

/**
 * @desc   validation layer for post new address to addresses list
 * @route  POST /api/v1/addresses
 * @access private / protected / user
 */
exports.addAddressValidator = [
  check("alias").notEmpty().withMessage("alias address is required"),

  check("details").notEmpty().withMessage("details is required"),

  check("phone")
    .notEmpty()
    .withMessage(
      "phone number is required and must belong to Egypt or Saudi Arabia",
    )
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("phone number must belong to Egypt or Saudi Arabia"),

  check("city").notEmpty().withMessage("city is required"),

  check("postalCode").notEmpty().withMessage("postalCode is required"),

  validateMiddleware,
];
