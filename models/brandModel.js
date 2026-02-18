const mongoose = require("mongoose");

// ** 2- make schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      trim: true,
      unique: [true, "brand name must be unique"],
      minlength: [3, "brand name must be at least 3 characters"],
      maxlength: [32, "brand name must be at most 32 characters"],
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
const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
