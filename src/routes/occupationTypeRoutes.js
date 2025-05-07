const express = require("express");
const {
  createOccupationType,
  deleteOccupationType,
  getOccupationTypes,
  getOccupationTypeDetail,
  updateOccupationType,
} = require("../controllers/occupationTypeController");
const { protect, authorize } = require("../middlewares/protect");

const router = express.Router();

router
  .route("/")
  .get(getOccupationTypes)
  .post(protect, authorize("ADMIN", "SUPERADMIN"), createOccupationType);

router
  .route("/:id")
  .get(getOccupationTypeDetail)
  .put(protect, authorize("ADMIN", "SUPERADMIN"), updateOccupationType)
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deleteOccupationType);

module.exports = router;
