const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const storage = multer.memoryStorage();
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5, files: 5 }, // Limit file size to 5MB
  });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
