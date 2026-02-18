const asyncHandler = require("express-async-handler");
const { default: slugify } = require("slugify");
const BrandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");

// @desc    Post a brand
// @route   POST /api/v1/brands
// @access  Private
exports.postBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await BrandModel.create({ name, slug: slugify(name) });

  res.status(201).json({
    success: true,
    data: brand,
    message: "Brand created successfully",
  });
});

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: req.query.sort === "asc" ? 1 : -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: brands.length,
    page,
    data: brands,
    message: "Brands retrieved successfully",
  });
});

// @desc   Get a single brand by id
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`Brand not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: brand,
    message: "Brand retrieved successfully",
  });
});

// @desc    Update a brand by id
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await BrandModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!brand) {
    return next(new ApiError(`Brand not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: brand,
    message: "Brand updated successfully",
  });
});

// @desc    Delete a brand by id
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`Brand not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
});
