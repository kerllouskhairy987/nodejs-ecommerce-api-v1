const CategoryModel = require("../models/categoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

// @desc    post categories
// @route   POST /api/v1/categories
// @access  private
exports.postCategories = createOne(CategoryModel);

// @desc    get list of categories
// @route   GET /api/v1/categories
// @access  public
exports.getListOfCategories = getAll(CategoryModel);

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
