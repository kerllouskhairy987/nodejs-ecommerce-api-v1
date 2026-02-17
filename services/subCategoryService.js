const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const subCategories = await SubCategoryModel.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: req.query.sort === "asc" ? 1 : -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: subCategories.length,
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
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  // build update object dynamically based on provided fields
  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.slug = slugify(name);
  }
  if (category) {
    updateData.category = category;
  }

  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    { _id: id },
    updateData,
    {
      new: true, // return the updated document after update
      runValidators: true, // run schema validators on the update operation
    },
  );

  if (!subCategory) {
    return next(new ApiError(`SubCategory not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: subCategory,
    message: "SubCategory updated successfully",
  });
});

// @desc   delete sub category by id
// @route   DELETE /api/v1/subCategories/:id
// @access  private
exports.deleteSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findByIdAndDelete({ _id: id });
  if (!subCategory) {
    return next(new ApiError(`SubCategory not found with this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "SubCategory deleted successfully",
  });
};
