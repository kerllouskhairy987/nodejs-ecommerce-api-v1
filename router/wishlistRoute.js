const express = require("express");
const { allowedTo, protect } = require("../services/authService");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedInUserWishlist,
  clearWishlist,
} = require("../services/wishlistService");
const {
  addProductToWishlistValidator,
  removeProductToWishlistValidator,
} = require("../utils/validators/wishlistValidator");

const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToWishlistValidator, addProductToWishlist)
  .get(getLoggedInUserWishlist)
  .delete(clearWishlist);

router.delete(
  "/:productId",
  removeProductToWishlistValidator,
  removeProductFromWishlist,
);

module.exports = router;
