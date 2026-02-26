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

const router = express.Router();

// @route   /api/v1/products/
router
  .route("/")
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    postProduct,
  )
  .get(getProducts);

// @route   /api/v1/products/:id
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
