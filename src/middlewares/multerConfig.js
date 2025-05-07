const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/AppError");
// Define storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = path.join(__dirname, "../../uploads/");

    // Set destination based on file type
    if (file.mimetype.startsWith("image/")) {
      dir += "products/"; // All images go to products for simplicity
    } else if (file.mimetype.startsWith("application/")) {
      dir += "documents/";
    } else if (file.mimetype.startsWith("video/")) {
      dir += "videos/";
    } else {
      return cb(new Error("Invalid file type."));
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and original name
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Set up Multer with a file size limit of 20 MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit per file
});

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      throw new AppError("File too large. Maximum size is 20 MB.", 400);
    }
    throw new AppError(`Multer Error: ${err.message}`, 400);
  } else if (err) {
    throw new AppError(err);
  }
  next();
};

module.exports = { upload, uploadErrorHandler }; // Export the upload configuration
