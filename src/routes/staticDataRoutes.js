// routes/staticDataRoutes.js
const express = require("express");
const {
  createStaticData,
  deleteStaticData,
  getStaticData,
  getStaticDataDetail,
  updateStaticData,
  getStaticDataByTitle,
} = require("../controllers/staticDataController");
const { protect, authorize } = require("../middlewares/protect");
const { upload } = require("../middlewares/multerConfig");

const router = express.Router();

router
  .route("/")
  .get(getStaticData)
  .post(
    protect,
    authorize("ADMIN", "SUPERADMIN"),
    upload.single("picture"),
    createStaticData
  );
router.route("/title/:id").get(getStaticDataByTitle);

router
  .route("/:id")
  .get(getStaticDataDetail)
  .put(
    protect,
    authorize("ADMIN", "SUPERADMIN"),
    upload.single("picture"),
    updateStaticData
  )
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deleteStaticData);

module.exports = router;
