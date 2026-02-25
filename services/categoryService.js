const asyncHandler = require("express-async-handler");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const CategoryModel = require("../models/categoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const ApiError = require("../utils/apiError");

// MemoryStorage
const storage = multer.memoryStorage();

// TODO: check if file is an image or not
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed", 400), false);
  }
};

const upload = multer({ storage, fileFilter });

// TODo: Middleware for uploading category image
exports.uploadCategoryImage = upload.single("image");

// TODO: Middleware for resizing category image
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;

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
