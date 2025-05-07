const catchAsync = require("../utils/catchAsync");
const fileServices = require("../services/fileServices");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.downloadPicture = catchAsync(async (req, res, next) => {
  const filePath = await fileServices.downloadPicture(req.params[0]);
  res.download(filePath, (err) => {
    if (err) {
      if (!res.headersSent) {
        return res
          .status(400)
          .json({ success: false, message: "Файл олдсонгүй" });
      }
    }
  });
});

exports.uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("File is required", 400);
    }

    // Start time capture
    const startTime = Date.now(); // You could also use performance.now() for more precision

    // Create a stream from the file buffer (in-memory data)
    const fileStream = streamifier.createReadStream(req.file.buffer);

    // Cloudinary upload options
    const cloudinaryOptions = {
      resource_type: "auto", // Automatically detect file type
      tags: ["tiptap"], // Optional: Add tags for easier management
      public_id: `tiptap/${req.file.originalname}`, // Optional: Specify custom public ID
      folder: "jsc-tiptap", // Optional: Upload to a specific folder
    };

    // Promise wrapper for the Cloudinary upload process
    const uploadFileToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          cloudinaryOptions,
          (error, result) => {
            // End time capture
            const endTime = Date.now(); // You could also use performance.now() here
            const uploadTime = endTime - startTime; // Time in milliseconds

            // Log or handle upload time
            console.log(`Cloudinary upload took ${uploadTime}ms`);

            if (error) {
              reject(new AppError("Failed to upload to Cloudinary", 500));
            } else {
              resolve(result);
            }
          }
        );

        // Pipe the file stream to Cloudinary
        fileStream.pipe(uploadStream);
      });
    };

    // Wait for the upload process to complete
    const result = await uploadFileToCloudinary();

    // Return the successful response
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error); // Forward the error to error handler middleware
  }
};
