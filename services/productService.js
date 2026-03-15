const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const ProductModel = require("../models/productModel");
const { uploadMixOfImages } = require("../middlewares/uploadImagesMiddleware");

// TODO: Middleware for uploading product images
exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// TODO: Middleware for resizing product images
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1- image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    req.body.imageCover = imageCoverFilename;
  }
  // 2- image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const filename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(1200, 800)
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${filename}`);

        // save image in Database
        req.body.images.push(filename);
      }),
    );
  }
  next();
});

// @desc    post a new product
// @route   POST /api/v1/products
// @access  Private
exports.postProduct = createOne(ProductModel);

// @desc    Get list of products (ULTRA OPTIMIZED)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = getAll(ProductModel);

// exports.getProducts = asyncHandler(async (req, res) => {
//   const {
//     // page = 1,
//     limit = 50,
//     sort,
//     fields,
//     keyword,
//     lastId, // cursor pagination
//     ...filters
//   } = req.query;

//   // TODO: 1) Build Filter Object
//   let mongoFilter = { ...filters };
//   let queryString = JSON.stringify(mongoFilter);
//   queryString = queryString.replace(
//     /\b(gt|gte|lt|lte|in)\b/g,
//     (match) => `$${match}`,
//   );
//   mongoFilter = JSON.parse(queryString);

//   // TODO: 2) TEXT SEARCH (INDEX FRIENDLY)
//   if (keyword) mongoFilter.$text = { $search: `"${keyword}"` };

//   // TODO: 3) CURSOR PAGINATION (بدل skip التقيل)
//   if (lastId) mongoFilter._id = { $lt: lastId };

//   // TODO: 4) Build Query
//   let mongooseQuery = ProductModel.find(mongoFilter)
//     .limit(Number(limit))
//     .populate({ path: "category", select: "name" })
//     .lean();

//   // TODO: 5) Sorting (Index Friendly)
//   if (sort) {
//     mongooseQuery = mongooseQuery.sort(sort.split(",").join(" "));
//   } else if (keyword) {
//     mongooseQuery = mongooseQuery.sort({ score: { $meta: "textScore" } });
//     mongooseQuery = mongooseQuery.select({
//       score: { $meta: "textScore" },
//     });
//   } else {
//     mongooseQuery = mongooseQuery.sort("-createdAt");
//   }

//   // TODO: 6) Fields Limiting
//   if (fields) {
//     mongooseQuery = mongooseQuery.select(fields.split(",").join(" "));
//   } else {
//     mongooseQuery = mongooseQuery.select("-__v");
//   }

//   // TODO: Execute Query
//   const products = await mongooseQuery;

//   res.status(200).json({
//     success: true,
//     count: products.length,
//     lastId: products.length ? products[products.length - 1]._id : null,
//     data: products,
//   });
// });

// @desc    Get a single product by id && populate reviews
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = getOne(ProductModel, "reviews");

// @desc    Update a product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = updateOne(ProductModel);

// @desc    Delete a product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = deleteOne(ProductModel);
