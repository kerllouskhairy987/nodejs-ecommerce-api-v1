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

// @desc    Get list of products (ULTRA OPTIMIZED)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    sort,
    fields,
    keyword,
    lastId, // 🔥 cursor pagination
    ...filters
  } = req.query;

  // =========================
  // 1) Build Filter Object
  // =========================

  let mongoFilter = { ...filters };

  // operators support (gt,gte,lt,lte,in)
  let queryString = JSON.stringify(mongoFilter);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );

  mongoFilter = JSON.parse(queryString);

  // =========================
  // 2) TEXT SEARCH (INDEX FRIENDLY)
  // =========================

  if (keyword) {
    mongoFilter.$text = { $search: `"${keyword}"` };
  }

  // =========================
  // 3) CURSOR PAGINATION 🔥
  // بدل skip التقيل
  // =========================

  if (lastId) {
    mongoFilter._id = { $lt: lastId };
  }

  // =========================
  // 4) Build Query
  // =========================

  let mongooseQuery = ProductModel.find(mongoFilter)
    .limit(Number(limit))
    .populate({ path: "category", select: "name" })
    .lean();

  // =========================
  // 5) Sorting (Index Friendly)
  // =========================

  if (sort) {
    const sorting = sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sorting);
  } else if (keyword) {
    // 🔥 مهم مع text index
    mongooseQuery = mongooseQuery.sort({ score: { $meta: "textScore" } });
    mongooseQuery = mongooseQuery.select({
      score: { $meta: "textScore" },
    });
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // =========================
  // 6) Fields Limiting
  // =========================

  if (fields) {
    mongooseQuery = mongooseQuery.select(fields.split(",").join(" "));
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // =========================
  // Execute Query
  // =========================

  const products = await mongooseQuery;

  res.status(200).json({
    success: true,
    count: products.length,
    lastId: products.length ? products[products.length - 1]._id : null,
    data: products,
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
