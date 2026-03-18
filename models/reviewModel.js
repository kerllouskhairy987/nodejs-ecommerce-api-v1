const mongoose = require("mongoose");
const ProductModel = require("./productModel");

const reviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      required: [true, "Review rating is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    // parent reference [scalable] {using virtuals populate to get childrens}
    product: {
      type: mongoose.Schema.Types.ObjectId, // mongoose reference
      ref: "Product",
      required: [true, "Product is required"],
    },
  },
  { timestamps: true },
);

// TODO: Text Search Index
reviewSchema.index({ title: "text" });

// TODO: Populate with mongoose middleware
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name profileImg",
  });
});

// TODO: Aggregation Pipeline to update ratingsQuantity and ratingsAverage
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId,
) {
  const result = await this.aggregate([
    // stage 1 ) product all reviews depend on specific productId
    { $match: { product: productId } },
    //  stage 2 ) update ratingsAverage and ratingsQuantity depend on productId
    {
      $group: {
        _id: "product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$ratings" },
      },
    },
  ]);

  if (result.length > 0) {
    // update product with new ratingsAverage and ratingsQuantity
    await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        ratingsQuantity: result[0].nRating,
        ratingsAverage: Math.round(result[0].avgRating * 10) / 10,
      },
    );
  } else {
    await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      },
    );
  }
};

// TODO: Post Save Hook [update ratingsAverage and ratingsQuantity]
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
// TODO: Post Remove Hook [update ratingsAverage and ratingsQuantity]
reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
  },
);

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
