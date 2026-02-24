const multer = require("multer");

const { v4: uuidv4 } = require("uuid");

const CategoryModel = require("../models/categoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

// DeskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    // category-${id}-${Data.now()}.jpeg
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

exports.uploadCategoryImage = upload.single("image");

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
