const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const SubCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const { deleteOne, updateOne } = require("./handlersFactory");

// @desc    set categoryId to body
// @route   POST /api/v1/categories/:categoryId/subCategories
// @access  private
exports.setCategoryIdToBody = (req, res, next) => {
  // nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc    post sub categories
// @route   POST /api/v1/subCategories
// @access  private
exports.postSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({
    success: true,
    data: subCategory,
    message: "SubCategory created successfully",
  });
});

// @desc    get list of sub categories
// @route   GET /api/v1/subCategories
// @access  public
exports.getSubCategories = asyncHandler(async (req, res) => {
  // TODO: --> get sub categories by category
  const queryObj = { ...req.query };
  if (req.params.categoryId) {
    console.log("done");
    queryObj.category = req.params.categoryId;
  }

  // TODO: 4) Build Mongoose Query
  const countDocuments = await SubCategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategoryModel.find(), queryObj)
    .filter()
    .search()
    .paginate(countDocuments)
    .sort()
    .limitFields();

  // TODO: 5) Execute Mongoose Query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;

  res.status(200).json({
    success: true,
    count: subCategories.length,
    paginationResult,
    lastId: subCategories.length
      ? subCategories[subCategories.length - 1]._id
      : null,
    data: subCategories,
    message: "SubCategories retrieved successfully",
  });
});

// @desc    get specific sub category by id
// @route   GET /api/v1/subCategories/:id
// @access  public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById({ _id: id });

  if (!subCategory) {
    return next(new ApiError("SubCategory not found", 404));
  }

  res.status(200).json({
    success: true,
    data: subCategory,
    message: "SubCategory retrieved successfully",
  });
});

// @desc   update sub category by id
// @route   PUT /api/v1/subCategories/:id
// @access  private
exports.updateSubCategory = updateOne(SubCategoryModel);

// @desc   delete sub category by id
// @route   DELETE /api/v1/subCategories/:id
// @access  private
exports.deleteSubCategory = deleteOne(SubCategoryModel);
