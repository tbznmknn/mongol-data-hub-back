const express = require("express");
const {
  createPost,
  deletePost,
  getPosts,
  getPostDetail,
  updatePost,
  getUniquePost,
} = require("../controllers/postsController");
const { protect, authorize } = require("../middlewares/protect");
const { upload } = require("../middlewares/multerConfig");

const router = express.Router();

router
  .route("/")
  .get(getPosts)
  .post(
    protect,
    authorize("ADMIN", "SUPERADMIN"),
    upload.single("picture"),
    createPost
  );
router.route("/unique/:type").get(getUniquePost);

router
  .route("/:id")
  .get(getPostDetail)
  .put(
    protect,
    authorize("ADMIN", "SUPERADMIN"),
    upload.single("picture"),
    updatePost
  )
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deletePost);

module.exports = router;
