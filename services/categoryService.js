const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

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
  // TODO: 4) Build Mongoose Query
  const countDocuments = await CategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
    .filter()
    .search()
    .paginate(countDocuments)
    .sort()
    .limitFields();

  // TODO: 5) Exec
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;

  res.status(200).json({
    success: true,
    count: categories.length,
    paginationResult,
    lastId: categories.length ? categories[categories.length - 1]._id : null,
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
