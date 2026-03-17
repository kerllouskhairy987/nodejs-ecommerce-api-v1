const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: [3, "name must be at least 3 characters"],
      maxlength: [32, "name must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: [true, "email must be unique"],
      lowercase: true,
    },
    phone: {
      type: String,
      unique: [true, "phone number must be unique"],
      sparse: true, // to make it optional [do not duplicate the key in db]
      trim: true,
    },
    profileImg: String,
    password: {
      type: String,
      required: [true, "password is required"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    // address
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true },
);

// TODO: Hash password on create
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // hashing user password
  this.password = await bcrypt.hash(this.password, 12);
});

// TODO: image URL
const imageUrlHandler = (doc) => {
  if (doc.profileImg && !doc.profileImg.startsWith("http")) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};

// findOne, findAll and Update
userSchema.post("init", (doc) => {
  imageUrlHandler(doc);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
