const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
} = require("./handlersFactory");

// @desc    post a new product
// @route   POST /api/v1/products
// @access  Private
exports.postProduct = createOne(ProductModel);

// @desc    Get list of products (ULTRA OPTIMIZED)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  // TODO: 4) Build Mongoose Query
  const countDocuments = await ProductModel.countDocuments();
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .filter()
    .search()
    .paginate(countDocuments)
    .sort()
    .limitFields();

  // TODO: 5) Execute Mongoose Query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;

  res.status(200).json({
    success: true,
    count: products.length,
    paginationResult,
    lastId: products.length ? products[products.length - 1]._id : null,
    data: products,
  });
});

// exports.getProducts = asyncHandler(async (req, res) => {
//   const {
//     // page = 1,
//     limit = 50,
//     sort,
//     fields,
//     keyword,
//     lastId, // cursor pagination
//     ...filters
//   } = req.query;

//   // TODO: 1) Build Filter Object
//   let mongoFilter = { ...filters };
//   let queryString = JSON.stringify(mongoFilter);
//   queryString = queryString.replace(
//     /\b(gt|gte|lt|lte|in)\b/g,
//     (match) => `$${match}`,
//   );
//   mongoFilter = JSON.parse(queryString);

//   // TODO: 2) TEXT SEARCH (INDEX FRIENDLY)
//   if (keyword) mongoFilter.$text = { $search: `"${keyword}"` };

//   // TODO: 3) CURSOR PAGINATION (بدل skip التقيل)
//   if (lastId) mongoFilter._id = { $lt: lastId };

//   // TODO: 4) Build Query
//   let mongooseQuery = ProductModel.find(mongoFilter)
//     .limit(Number(limit))
//     .populate({ path: "category", select: "name" })
//     .lean();

//   // TODO: 5) Sorting (Index Friendly)
//   if (sort) {
//     mongooseQuery = mongooseQuery.sort(sort.split(",").join(" "));
//   } else if (keyword) {
//     mongooseQuery = mongooseQuery.sort({ score: { $meta: "textScore" } });
//     mongooseQuery = mongooseQuery.select({
//       score: { $meta: "textScore" },
//     });
//   } else {
//     mongooseQuery = mongooseQuery.sort("-createdAt");
//   }

//   // TODO: 6) Fields Limiting
//   if (fields) {
//     mongooseQuery = mongooseQuery.select(fields.split(",").join(" "));
//   } else {
//     mongooseQuery = mongooseQuery.select("-__v");
//   }

//   // TODO: Execute Query
//   const products = await mongooseQuery;

//   res.status(200).json({
//     success: true,
//     count: products.length,
//     lastId: products.length ? products[products.length - 1]._id : null,
//     data: products,
//   });
// });

// @desc    Get a single product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = getOne(ProductModel);

// @desc    Update a product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = updateOne(ProductModel);

// @desc    Delete a product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = deleteOne(ProductModel);
