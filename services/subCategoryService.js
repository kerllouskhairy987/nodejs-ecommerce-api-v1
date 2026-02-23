const asyncHandler = require("express-async-handler");
const SubCategoryModel = require("../models/subCategoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
} = require("./handlersFactory");

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
exports.postSubCategory = createOne(SubCategoryModel);

// @desc    get list of sub categories
// @route   GET /api/v1/subCategories
// @access  public
exports.getSubCategories = asyncHandler(async (req, res) => {
  // TODO: --> get sub categories by category
  const queryObj = { ...req.query };
  if (req.params.categoryId) {
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
exports.getSubCategory = getOne(SubCategoryModel);

// @desc   update sub category by id
// @route   PUT /api/v1/subCategories/:id
// @access  private
exports.updateSubCategory = updateOne(SubCategoryModel);

// @desc   delete sub category by id
// @route   DELETE /api/v1/subCategories/:id
// @access  private
exports.deleteSubCategory = deleteOne(SubCategoryModel);
