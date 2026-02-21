const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const SubCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

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
  const {
    // page = 1,
    limit,
    fields,
    sort = "desc",
    keyword,
    lastId,
    ...filters
  } = req.query;

  // TODO: 1) Build Filter Object
  let mongoFilter = { ...filters };
  console.log(mongoFilter); //{ price: { gte: '1200' } }
  let queryString = JSON.stringify(mongoFilter);
  console.log(queryString); //{"price":{"gte":"1200"}}
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );
  console.log(queryString); //{"price":{"$gte":"1200"}}
  mongoFilter = JSON.parse(queryString);
  console.log(mongoFilter); // { price: { '$gte': '1200' } }

  // TODO: 2) Normal Search Index
  if (keyword) mongoFilter.name = { $regex: keyword.trim(), $options: "i" };

  // TODO: 3) Cursor Pagination
  if (lastId) {
    if (sort === "asc") {
      mongoFilter._id = { $gt: lastId };
    } else if (sort === "desc") {
      mongoFilter._id = { $lt: lastId };
    }
  }

  // TODO: 4) Build Mongoose Query
  const mongooseQuery = SubCategoryModel.find(mongoFilter).limit(limit).lean();

  // TODO: 5) Sort
  if (sort === "asc") {
    mongooseQuery.sort({ createdAt: 1 });
  } else if (sort === "desc") {
    mongooseQuery.sort({ createdAt: -1 });
  }

  // TODO: 6) Fields Limiting
  if (fields) mongooseQuery.select(fields.split(",").join(" "));

  if (req.params.categoryId)
    mongoFilter = { ...mongoFilter, category: req.params.categoryId };

  const subCategories = await mongooseQuery;

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

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    { _id: id },
    req.body,
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
