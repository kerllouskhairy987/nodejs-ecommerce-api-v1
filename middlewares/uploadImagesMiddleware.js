const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  // MemoryStorage
  const storage = multer.memoryStorage();

  // TODO: check if file is an image or not
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  const upload = multer({ storage, fileFilter });

  return upload.single(fieldName);
};
