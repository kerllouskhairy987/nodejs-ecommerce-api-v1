const mongoose = require("mongoose");

// ** 2- make schema && 3- make modal
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      unique: [true, "category name must be unique"],
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

// TODO: Text Search Index
categorySchema.index({ name: "text" });

// TODO: image url
const imageUrlHandler = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and Update
categorySchema.post("init", (doc) => {
  imageUrlHandler(doc);
});
// create
categorySchema.post("save", (doc) => {
  imageUrlHandler(doc);
});

// ** 3- make modal
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
