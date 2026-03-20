const express = require("express");
const {
  addProductToCart,
  getLoggedInUserCart,
  removeItemFromCartItems,
  clearCartItems,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");
const {
  addProductToCartValidator,
  removeItemFromCartItemsValidator,
  updateCartItemQuantityValidator,
} = require("../utils/validators/cartValidator");

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getLoggedInUserCart)
  .delete(clearCartItems);

router.put("/apply-coupon", applyCoupon);

router
  .route("/:cartItemId")
  .put(updateCartItemQuantityValidator, updateCartItemQuantity)
  .delete(removeItemFromCartItemsValidator, removeItemFromCartItems);

module.exports = router;
