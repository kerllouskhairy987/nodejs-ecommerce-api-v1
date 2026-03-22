const { check } = require("express-validator");
const cartModel = require("../../models/cartModel");
const ApiError = require("../apiError");
const validateMiddleware = require("../../middlewares/categoryMiddleware");

/**
 * @desc     create order validators
 * @route    POST /api/v1/orders/:cartItemId
 * @access   private/protect/user
 */
exports.createCashOrderValidator = [
  check("cartItemId")
    .isMongoId()
    .withMessage("Invalid cart item ID format")
    .custom(async (cartItemId) => {
      const cart = await cartModel.findById(cartItemId);
      if (!cart)
        throw new ApiError(
          `Cart not found with this id --> ${cartItemId}`,
          404,
        );
    }),

  validateMiddleware,
];
