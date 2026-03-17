const { check } = require("express-validator");
const ApiError = require("../apiError");
const validateMiddleware = require("../../middlewares/categoryMiddleware");
const ProductModel = require("../../models/productModel");
const User = require("../../models/userModel");

exports.addProductToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("invalid Id format")
    .custom(async (val) => {
      const product = await ProductModel.findById(val);
      if (!product) throw new ApiError(404, "Product not found");
    }),

  validateMiddleware,
];

exports.removeProductToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("invalid Id format")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user.id);
      if (!user.wishlist.includes(val))
        throw new ApiError("this product does not exist in your wishlist", 404);
    }),

  validateMiddleware,
];
