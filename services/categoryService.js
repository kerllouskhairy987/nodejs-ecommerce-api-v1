const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const apiError = require("../utils/apiError");

// @desc    post categories
// @route   POST /api/v1/categories
// @access  private
exports.postCategories = asyncHandler(async (req, res) => {
  const name = req.body.name;

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({
    success: true,
    count: categories.length,
    page,
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
    // res.status(404).json({
    //   success: false,
    //   message: `Category not found with this id ${id}`,
    // });
    // return;
    return next(new apiError(`Category not found with this id ${id}`, 404));
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
    { ...req.body, slug: slugify(req.body.name) },
    {
      new: true, // return the updated document after update
      runValidators: true,
    },
  );
  if (!category) {
    // res.status(404).json({
    //   success: false,
    //   message: `Category not found with this id ${id}`,
    // });
    // return;
    return next(new apiError(`Category not found with this id ${id}`, 404));
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
    // res.status(404).json({
    //   success: false,
    //   message: `Category not found with this id ${id}`,
    // });
    // return;
    return next(new apiError(`Category not found with this id ${id}`, 404));
  }
  res.status(204).json({
    success: true,
    message: "Category deleted successfully",
  });
});
