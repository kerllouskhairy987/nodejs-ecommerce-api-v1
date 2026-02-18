const asyncHandler = require("express-async-handler");
const { default: slugify } = require("slugify");

const ProductModel = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc    post a new product
// @route   POST /api/v1/products
// @access  Private
exports.postProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);

  const product = await ProductModel.create(req.body);
  res.status(201).json({
    success: true,
    data: product,
    message: "Product created successfully",
  });
});

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await ProductModel.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: req.query.sort === "asc" ? 1 : -1 })
    .populate({ path: "category", select: "name" })
    .lean();

  res.status(200).json({
    success: true,
    count: products.length,
    page,
    limit,
    data: products,
    message: "Products retrieved successfully",
  });
});

// @desc    Get a single product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById({ _id: id }).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(new ApiError(`Product not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product,
    message: "Product retrieved successfully",
  });
});

// @desc    Update a product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await ProductModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  }).populate("category", "name");

  if (!product) {
    return next(new ApiError(`Product not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product,
    message: "Product updated successfully",
  });
});

// @desc    Delete a product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete({ _id: id });

  if (!product) {
    return next(new ApiError(`Product not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
