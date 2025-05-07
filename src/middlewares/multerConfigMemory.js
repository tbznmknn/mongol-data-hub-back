const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const AppError = require("../utils/AppError");

// Set a maximum file size and destination (could be Cloudinary or local storage)
const storage = multer.memoryStorage(); // Storing files in memory before streaming them

// Configure multer with memory storage and size limit
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // Limit file size to 15MB
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new AppError("Only image files are allowed!", 400), false);
    }
  },
});

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
  next();
};

const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("File is required", 400));
  }

  try {
    // Stream the file to Cloudinary
    const fileBuffer = req.file.buffer; // File buffer from multer memory storage

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" }, // Automatically detect the file type
      (error, result) => {
        if (error) {
          return next(new AppError("Failed to upload file to Cloudinary", 500));
        }
        res.status(200).json({ success: true, data: result });
      }
    );

    const fileStream = streamifier.createReadStream(fileBuffer);
    fileStream.pipe(uploadStream);
  } catch (error) {
    return next(new AppError("Failed to upload file", 500));
  }
};

module.exports = { upload, uploadErrorHandler, uploadToCloudinary };
