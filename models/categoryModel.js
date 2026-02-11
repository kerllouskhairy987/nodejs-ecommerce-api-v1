const { mongoose } = require("mongoose");

// ** 2- make schema && 3- make modal
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "category name must be at least 3 characters"],
      maxlength: [32, "category name must be at most 32 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    image: String,
  },
  { timestamps: true },
);

// ** 3- make modal
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
