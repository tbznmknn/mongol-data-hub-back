const express = require("express");
const {
  // createProducts,
  downloadPicture,
  uploadToCloudinary,
} = require("../controllers/fileController");
const validateRequest = require("../middlewares/validateRequests"); // Import the validation middleware
const { protect, authorize } = require("../middlewares/protect");

const router = express.Router();
const {
  upload,
  uploadErrorHandler,
} = require("../middlewares/multerConfigMemory");
// router.route("/createproduct").post(
//   protect,
//   authorize("VENDOR", "ADMIN", "SUPERADMIN"),
//   upload.array("images", 50), //Allow up to 50 separate files.
//   uploadErrorHandler,
//   createProducts
// );

router.post(
  "/cloudinary",
  upload.single("file"),
  uploadErrorHandler,
  uploadToCloudinary
);
router.route("/picture/*").get(downloadPicture);
module.exports = router;
