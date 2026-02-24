const SubCategoryModel = require("../models/subCategoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
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
exports.getSubCategories = getAll(SubCategoryModel);

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
