const mongoose = require("mongoose");

// ** 2- make schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "sub category name is required"],
      trim: true,
      unique: [true, "sub category name must be unique"],
      minlength: [2, "sub category name must be at least 2 characters"],
      maxlength: [32, "sub category name must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to main category"],
    },
  },
  { timestamps: true },
);

// ** 3- make modal
const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategoryModel;
