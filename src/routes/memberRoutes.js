const express = require("express");
const {
  createMember,
  deleteMember,
  getMembers,
  getMemberDetail,
  updateMember,
  getMemberKeys,
} = require("../controllers/memberController");
const { protect, authorize } = require("../middlewares/protect");
const { upload } = require("../middlewares/multerConfig");

const router = express.Router();

router
  .route("/")
  .get(getMembers)
  .post(
    protect,
    authorize("ADMIN", "SUPERADMIN"),
    upload.single("picture"),
    createMember
  );
router.route("/keys").get(getMemberKeys);

router
  .route("/:id")
  .get(getMemberDetail)
  .put(
    protect,
    authorize("ADMIN", "SUPERADMIN"),
    upload.single("picture"),
    updateMember
  )
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deleteMember);

module.exports = router;
