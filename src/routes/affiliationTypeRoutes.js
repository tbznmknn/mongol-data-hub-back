const express = require("express");
const {
  createAffiliationType,
  deleteAffiliationType,
  getAffiliationTypes,
  getAffiliationTypeDetail,
  updateAffiliationType,
} = require("../controllers/affiliationTypeController");
const { protect, authorize } = require("../middlewares/protect");

const router = express.Router();

router
  .route("/")
  .get(getAffiliationTypes)
  .post(protect, authorize("ADMIN", "SUPERADMIN"), createAffiliationType);

router
  .route("/:id")
  .get(getAffiliationTypeDetail)
  .put(protect, authorize("ADMIN", "SUPERADMIN"), updateAffiliationType)
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deleteAffiliationType);

module.exports = router;
