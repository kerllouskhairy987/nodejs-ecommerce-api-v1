const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const CategoryModel = require("../models/categoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");

// TODo: Middleware for uploading category image
exports.uploadCategoryImage = uploadSingleImage("image");

// TODO: Middleware for resizing category image
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    // save image in Database
    req.body.image = filename;
  }

  next();
});

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
