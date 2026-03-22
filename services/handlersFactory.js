const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc    delete one document
// @route   DELETE /api/v1/:Model/:id
// @access  Private
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`document not found with this id ${id}`, 404));
    }

    // trigger "delete" event when update document to run deleteOne middleware in review model and update ratingsAverage and ratingsQuantity
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "document deleted successfully",
    });
  });

// @desc    update one document
// @route   PUT /api/v1/:Model/:id
// @access  Private
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(
        new ApiError(`document not found with this id ${req.params.id}`, 404),
      );
    }

    // trigger "save" event when update document to run save middleware in review model and update ratingsAverage and ratingsQuantity
    await document.save();

    res.status(200).json({
      success: true,
      data: document,
      message: "document updated successfully",
    });
  });

// @desc    create one document
// @route   POST /api/v1/:Model
// @access  Private
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      success: true,
      data: newDocument,
      message: "newDocument created successfully",
    });
  });

/**
 * @desc    get one document by id
 * @route   GET /api/v1/:Model/:id
 * @access  public
 * @params  Model[required] - populateOptions[optional]
 */
exports.getOne = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    // 1) Build query
    let query = Model.findById(req.params.id);
    if (populationOptions) query = query.populate(populationOptions);

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(
        new ApiError(`document not found with this id ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      data: document,
      message: "document retrieved successfully",
    });
  });

// @desc     get all document
// @route    GET /api/v1/:Model
// @access   Public
exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    // TODO: --> get sub categories by category
    const queryObj = { ...req.query };
    // nested route for category and sub category
    if (req.params.categoryId) queryObj.category = req.params.categoryId;
    // nested route for product and reviews
    if (req.params.productId) queryObj.product = req.params.productId;
    // get all orders for user
    if (req.user.role === "user") queryObj.user = req.user.id; // queryObj.user = req.user.id; === queryObj = { user: req.user.id };

    // TODO: 4) Build Mongoose Query
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(), queryObj)
      .filter()
      .search()
      .paginate(countDocuments)
      .sort()
      .limitFields();

    // TODO: 5) Execute Mongoose Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({
      success: true,
      count: documents.length,
      paginationResult,
      lastId: documents.length ? documents[documents.length - 1]._id : null,
      data: documents,
      message: "documents retrieved successfully",
    });
  });
