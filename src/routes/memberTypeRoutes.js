const express = require("express");
const {
  createMemberType,
  deleteMemberType,
  getMemberTypes,
  getMemberTypeDetail,
  updateMemberType,
} = require("../controllers/memberTypeController");
const { protect, authorize } = require("../middlewares/protect");

const router = express.Router();

router
  .route("/")
  .get(getMemberTypes)
  .post(protect, authorize("ADMIN", "SUPERADMIN"), createMemberType);

router
  .route("/:id")
  .get(getMemberTypeDetail)
  .put(protect, authorize("ADMIN", "SUPERADMIN"), updateMemberType)
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deleteMemberType);

module.exports = router;
