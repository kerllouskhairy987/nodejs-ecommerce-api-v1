const { check } = require("express-validator");
const ApiError = require("../apiError");
const ProductModel = require("../../models/productModel");
const validateMiddleware = require("../../middlewares/categoryMiddleware");
const cartModel = require("../../models/cartModel");

/**
 * @desc    add product to cart
 * @route   POST /api/v1/cart
 * @access  private / protected / user
 */
exports.addProductToCartValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product ID format")
    .custom(async (productId, { req }) => {
      const product = await ProductModel.findById(productId);
      if (!product) throw new ApiError("Product not found", 404);
    }),

  check("color").notEmpty().withMessage("color is required"),

  validateMiddleware,
];

/**
 * @desc    remove specific cart item
 * @route   DELETE /api/v1/cart/:cartItemId
 * @access  private / protected / user
 */
exports.removeItemFromCartItemsValidator = [
  check("cartItemId")
    .isMongoId()
    .withMessage("Invalid cart item ID format")
    .custom(async (cartItemId) => {
      const cartItem = await cartModel.findOne({
        cartItems: { $elemMatch: { _id: cartItemId } },
      });
      if (!cartItem) throw new ApiError("Cart item not found", 404);
    }),
  validateMiddleware,
];

/**
 * @desc   update cart item quantity
 * @route  PUT /api/v1/cart/:cartItemId
 * @access private / protected / user
 */
exports.updateCartItemQuantityValidator = [
  check("cartItemId")
    .isMongoId()
    .withMessage("Invalid cart item ID format")
    .custom(async (cartItemId) => {
      const cart = await cartModel.findOne({
        cartItems: { $elemMatch: { _id: cartItemId } },
      });
      if (!cart) throw new ApiError("Cart item not found", 404);
    }),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive number")
    .custom(async (quantity, { req }) => {
      const cart = await cartModel.findOne({
        cartItems: { $elemMatch: { _id: req.params.cartItemId } },
      });
      console.log(cart);
      const product = await ProductModel.findById(cart.cartItems[0].product);
      console.log(product);
      if (quantity > product.quantity) {
        throw new ApiError(
          `Quantity must be less than or equal to ${product.quantity}`,
          400,
        );
      }
    }),
  validateMiddleware,
];
