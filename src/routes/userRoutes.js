const express = require("express");
const {
  getUsers,
  editUserDetailsBySameUser,
  getUserDetailByAdmin,
  getUserDetailBySameUser,
} = require("../controllers/userController");
const { editUserDetailsSchema } = require("../schemas/userSchema"); // Import the Zod schema
// const { loginSchema, createUserSchema } = require("../schemas/userSchema"); // Import the Zod schema
const validateRequest = require("../middlewares/validateRequests"); // Import the validation middleware
const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();
// router.route("/register").post(validateRequest(createUserSchema), createUser);
router
  .route("/getusers")
  .get(protect, authorize("ADMIN", "SUPERADMIN"), getUsers); // Хэрэглэгчийн эрх солих. Админ нь л хийж болно. Өөрийнхөө эрхээ өөрчилж болохгүй
router
  .route("/getuserdetail/:id")
  .get(protect, authorize("ADMIN", "SUPERADMIN"), getUserDetailByAdmin); // Админаар хэрэглэгчийн мэдээлэл харна.
router.route("/getuserdetail").get(protect, getUserDetailBySameUser); // Өөрийнхөө хэрэглэгчийн мэдээлэл харна
router
  .route("/edituserdetail")
  .put(
    protect,
    validateRequest(editUserDetailsSchema),
    editUserDetailsBySameUser
  ); // Өөрийнхөө USER мэдээллээ засна. !!! input validation saijruulah heregtei !!!

module.exports = router;
