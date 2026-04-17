const express = require("express");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const {
  postProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
const { allowedTo, protect } = require("../services/authService");
const reviewRoute = require("./reviewRoute");

const router = express.Router();

/**
 * @desc     nested route for get all reviews on specific product by id OR create review on specific product OR get specific review on specific product
 * @route    GET /api/v1/products/:productId/reviews
 * @method   POST OR GET
 * @access   public
 */
router.use("/:productId/reviews", reviewRoute);

// @route   /api/v1/products/
router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    postProduct,
  )
  .get(protect, getProducts);

// @route   /api/v1/products/:id
router
  .route("/:id")
  .get(protect, getProductValidator, getProduct)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
