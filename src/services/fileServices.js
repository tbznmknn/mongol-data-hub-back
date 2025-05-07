const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
exports.downloadPicture = async (params) => {
  console.log("params", params);
  const filename = params;
  console.log("filename", filename);
  const filePath = path.join(__dirname, "../../", filename);
  console.log("filePath", filePath);
  if (!filename.startsWith("uploads/products")) {
    throw new AppError("It is not picture file", 403);
  }
  return filePath;
  //   res.download(filePath, (err) => {
  //     if (err) {
  //       if (!res.headersSent) {
  //         throw new AppError("File not found", 404);
  //       }
  //     }
  //   });
};
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (file) => {
  try {
    if (!file) throw new AppError("No file provided", 400);
    console.log(file);

    const uploadResponse = await cloudinary.uploader.upload(file);
    console.log("Aaaaa");
    // // Delete local file after uploading to Cloudinary

    return {
      public_id: uploadResponse.public_id,
      secure_url: uploadResponse.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new AppError("Failed to upload file", 500);
  }
};
