const catchAsync = require("../utils/catchAsync");
const timelineService = require("../services/timelineService");

exports.createTimeline = catchAsync(async (req, res, next) => {
  const timeline = await timelineService.createTimeline(req.body);
  res.status(201).json({
    success: true,
    data: timeline,
    message: "Timeline created successfully",
  });
});

exports.getTimelines = catchAsync(async (req, res, next) => {
  const { timelines, pagination } = await timelineService.getTimelines(
    req.query
  );
  res.status(200).json({
    success: true,
    data: timelines,
    pagination,
  });
});

exports.getTimelineDetail = catchAsync(async (req, res, next) => {
  const timeline = await timelineService.getTimelineDetail(req.params.id);
  res.status(200).json({ success: true, data: timeline });
});

exports.updateTimeline = catchAsync(async (req, res, next) => {
  const updatedTimeline = await timelineService.updateTimeline(
    req.params.id,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Timeline updated successfully",
    data: updatedTimeline,
  });
});

exports.deleteTimeline = catchAsync(async (req, res, next) => {
  const deletedTimeline = await timelineService.deleteTimeline(req.params.id);
  res.status(200).json({
    success: true,
    data: deletedTimeline,
    message: "Timeline deleted successfully",
  });
});
