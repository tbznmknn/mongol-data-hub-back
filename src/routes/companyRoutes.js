const express = require("express");
const {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyDetail,
  updateCompany,
  getOverview,
  getOverviewAdmin,
  getOccupationKeys,
  getAffiliationKeys,
} = require("../controllers/companyController");
const { protect, authorize } = require("../middlewares/protect");
const { upload } = require("../middlewares/multerConfig");

const router = express.Router();

router
  .route("/")
  .get(getCompanies)
  .post(
    protect,
    upload.single("picture"),
    authorize("ADMIN", "SUPERADMIN"),
    createCompany
  );
router.route("/overview").get(getOverview);
router.route("/occupationKeys").get(getOccupationKeys);
router.route("/affiliationKeys").get(getAffiliationKeys);

router
  .route("/overviewAdmin")
  .get(protect, authorize("ADMIN", "SUPERADMIN"), getOverviewAdmin);
router
  .route("/:id")
  .get(getCompanyDetail)
  .put(
    protect,
    authorize("ADMIN", "SUPERADMIN"),
    upload.single("picture"),
    updateCompany
  )
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deleteCompany);

module.exports = router;
