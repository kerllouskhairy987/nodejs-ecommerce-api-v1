const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const ProductModel = require("../models/productModel");
const { uploadMixOfImages } = require("../middlewares/uploadImagesMiddleware");

// TODO: Middleware for uploading product images
exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// TODO: Middleware for resizing product images
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1- image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    req.body.imageCover = imageCoverFilename;
  }
  // 2- image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const filename = `product-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(1200, 800)
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${filename}`);

        // save image in Database
        req.body.images.push(filename);
      }),
    );
  }
  next();
});

// @desc    post a new product
// @route   POST /api/v1/products
// @access  Private
exports.postProduct = createOne(ProductModel);

// @desc    Get list of products (ULTRA OPTIMIZED)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = getAll(ProductModel);

// @desc    Get a single product by id && populate reviews
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = getOne(ProductModel, "reviews");

// @desc    Update a product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = updateOne(ProductModel);

// @desc    Delete a product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = deleteOne(ProductModel);
