const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc    delete one document
// @route   DELETE /api/v1/:Model/:id
// @access  Private
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`document not found with this id ${id}`, 404));
    }

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

// @desc    get one document
// @route   GET /api/v1/:Model/:id
// @access  Public
exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

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
