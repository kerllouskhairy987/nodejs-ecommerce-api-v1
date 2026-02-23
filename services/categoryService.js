const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
} = require("./handlersFactory");

// @desc    post categories
// @route   POST /api/v1/categories
// @access  private
exports.postCategories = createOne(CategoryModel);

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
exports.getSingleCategoryById = getOne(CategoryModel);

// @desc    update category by id
// @route   PUT /api/v1/categories/:id
// @access  private
exports.updateCategoryById = updateOne(CategoryModel);

// @desc    delete category by id
// @route   DELETE /api/v1/categories/:id
// @access  private
exports.deleteCategoryById = deleteOne(CategoryModel);
