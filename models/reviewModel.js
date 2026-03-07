const mongoose = require("mongoose");

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
    product: {
      type: mongoose.Schema.Types.ObjectId,
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
    select: "name -_id",
  });
});

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
