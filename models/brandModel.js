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

// TODO: image url
const imageUrlHandler = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and Update
brandSchema.post("init", (doc) => {
  imageUrlHandler(doc);
});

brandSchema.post("save", (doc) => {
  imageUrlHandler(doc);
});

// ** 3- make modal
const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
