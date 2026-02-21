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
  const {
    page,
    limit,
    sort = "desc",
    fields,
    keyword,
    lastId,
    ...filters
  } = req.query;

  // TODO: 2) Build Filter Object
  let mongoFilter = { ...filters };
  console.log(mongoFilter); //{ price: { gt: '100' } }
  let queryString = JSON.stringify(mongoFilter);
  console.log(queryString); //{"price":{"gt":"100"}}
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );
  console.log(queryString); //{"price":{"$gt":"100"}}
  mongoFilter = JSON.parse(queryString);
  console.log(mongoFilter); // { price: { '$gt': '100' } }

  // TODO: 2) Normal Search Index
  if (keyword) {
    mongoFilter.name = { $regex: keyword.trim(), $options: "i" };
  }

  // TODO: 3) Cursor Pagination
  if (lastId) {
    if (sort && sort === "asc") {
      mongoFilter._id = { $gt: lastId };
    } else if (sort && sort === "desc") {
      mongoFilter._id = { $lt: lastId };
    }
  }

  // TODO: 4) Build Mongoose Query
  const mongooseQuery = BrandModel.find(mongoFilter).limit(limit).lean();

  // TODO: 5) Sort
  if (sort === "asc") {
    mongooseQuery.sort({ createdAt: 1 });
  } else if (sort === "desc") {
    mongooseQuery.sort({ createdAt: -1 });
  }

  // TODO: 6) Fields Limiting
  if (fields) {
    console.log(fields);
    mongooseQuery.select(fields.split(",").join(" "));
  }

  const brands = await mongooseQuery;

  res.status(200).json({
    success: true,
    count: brands.length,
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
