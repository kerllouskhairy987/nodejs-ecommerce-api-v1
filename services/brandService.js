const BrandModel = require("../models/brandModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

// @desc    Post a brand
// @route   POST /api/v1/brands
// @access  Private
exports.postBrand = createOne(BrandModel);

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = getAll(BrandModel);

// exports.getBrands = asyncHandler(async (req, res) => {
//   const {
//     page,
//     limit,
//     sort = "desc",
//     fields,
//     keyword,
//     lastId,
//     ...filters
//   } = req.query;

//   // TODO: 2) Build Filter Object
//   let mongoFilter = { ...filters };
//   console.log(mongoFilter); //{ price: { gt: '100' } }
//   let queryString = JSON.stringify(mongoFilter);
//   console.log(queryString); //{"price":{"gt":"100"}}
//   queryString = queryString.replace(
//     /\b(gt|gte|lt|lte|in)\b/g,
//     (match) => `$${match}`,
//   );
//   console.log(queryString); //{"price":{"$gt":"100"}}
//   mongoFilter = JSON.parse(queryString);
//   console.log(mongoFilter); // { price: { '$gt': '100' } }

//   // TODO: 2) Normal Search Index
//   if (keyword)
//     mongoFilter.name = { $regex: `^${keyword.trim()}`, $options: "i" };

//   // TODO: 3) Cursor Pagination
//   if (lastId) {
//     if (sort && sort === "asc") {
//       mongoFilter._id = { $gt: lastId };
//     } else if (sort && sort === "desc") {
//       mongoFilter._id = { $lt: lastId };
//     }
//   }

//   // TODO: 4) Build Mongoose Query
//   const mongooseQuery = BrandModel.find(mongoFilter).limit(limit).lean();

//   // TODO: 5) Sort
//   if (sort === "asc") {
//     mongooseQuery.sort({ createdAt: 1 });
//   } else if (sort === "desc") {
//     mongooseQuery.sort({ createdAt: -1 });
//   }

//   // TODO: 6) Fields Limiting
//   if (fields) {
//     console.log(fields);
//     mongooseQuery.select(fields.split(",").join(" "));
//   }

//   const brands = await mongooseQuery;

//   res.status(200).json({
//     success: true,
//     count: brands.length,
//     data: brands,
//     message: "Brands retrieved successfully",
//   });
// });

// @desc   Get a single brand by id
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = getOne(BrandModel);

// @desc    Update a brand by id
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = updateOne(BrandModel);

// @desc    Delete a brand by id
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = deleteOne(BrandModel);
