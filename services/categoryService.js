const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");

// @desc    post categories
// @route   POST /api/v1/categories
// @access  private
exports.postCategories = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await CategoryModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({
    data: category,
    message: "Category created successfully",
  });
});

// @desc    get list of categories
// @route   GET /api/v1/categories
// @access  public
exports.getListOfCategories = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    sort = "desc",
    fields,
    keyword,
    lastId,
    ...filters
  } = req.query;

  // TODO: 1) Build Filter Object
  let mongoFilter = { ...filters };
  console.log(mongoFilter); // { price: { gte: '100' } }
  let queryString = JSON.stringify(mongoFilter);
  console.log(queryString); // {"price":{"gte":"100"}}
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );
  console.log(queryString); // {"price":{"$gte":"100"}}
  mongoFilter = JSON.parse(queryString);
  console.log(mongoFilter); // { price: { '$gte': '100' } }

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

  // TODO: 5) Mongoose Query
  const mongooseQuery = CategoryModel.find(mongoFilter).limit(limit).lean();

  // TODO: 4) Sort
  if (sort === "asc") {
    mongooseQuery.sort({ createdAt: 1 });
  } else if (sort === "desc") {
    mongooseQuery.sort({ createdAt: -1 });
  }

  // TODO: 6) Fields Limiting
  if (fields) {
    mongooseQuery.select(fields.split(",").join(" "));
  } else {
    mongooseQuery.select("-__v");
  }

  const categories = await mongooseQuery;

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
    message: "Categories retrieved successfully",
  });
});

// @desc    get single category by id
// @route   GET /api/v1/categories/:id
// @access  public
exports.getSingleCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`Category not found with this id ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: category,
    message: "Category retrieved successfully",
  });
});

// @desc    update category by id
// @route   PUT /api/v1/categories/:id
// @access  private
exports.updateCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findByIdAndUpdate(
    { _id: id },
    { name: req.body.name, slug: slugify(req.body.name) },
    {
      new: true, // return the updated document after update
      runValidators: true,
    },
  );
  if (!category) {
    return next(new ApiError(`Category not found with this id ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: category,
    message: "Category updated successfully",
  });
});

// @desc    delete category by id
// @route   DELETE /api/v1/categories/:id
// @access  private
exports.deleteCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`Category not found with this id ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
