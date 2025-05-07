const express = require("express");
const {
  createTimeline,
  deleteTimeline,
  getTimelines,
  getTimelineDetail,
  updateTimeline,
} = require("../controllers/timelineController");
const { protect, authorize } = require("../middlewares/protect");

const router = express.Router();

router
  .route("/")
  .get(getTimelines)
  .post(protect, authorize("ADMIN", "SUPERADMIN"), createTimeline);

router
  .route("/:id")
  .get(getTimelineDetail)
  .put(protect, authorize("ADMIN", "SUPERADMIN"), updateTimeline)
  .delete(protect, authorize("ADMIN", "SUPERADMIN"), deleteTimeline);

module.exports = router;
