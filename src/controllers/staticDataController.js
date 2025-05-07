// controllers/staticDataController.js
const staticDataService = require("../services/staticDataService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createStaticData = catchAsync(async (req, res) => {
  const imageUrl = req.file ? req.file.filename : null;
  const data = req.body;

  const newStaticData = await staticDataService.createStaticData(
    data,
    imageUrl
  );
  res.status(201).json({ success: true, data: newStaticData });
});

exports.getStaticData = catchAsync(async (req, res) => {
  const { data, pagination } = await staticDataService.getStaticData(req.query);
  res.status(200).json({ success: true, data, pagination });
});

exports.getStaticDataDetail = catchAsync(async (req, res) => {
  const staticData = await staticDataService.getStaticDataDetail(req.params.id);
  res.status(200).json({ success: true, data: staticData });
});
exports.getStaticDataByTitle = catchAsync(async (req, res) => {
  const staticData = await staticDataService.getStaticDataByTitle(
    req.params.id
  );
  res.status(200).json({ success: true, data: staticData });
});

exports.updateStaticData = catchAsync(async (req, res) => {
  const imageUrl = req.file ? req.file.filename : null;
  const data = req.body;

  const updatedStaticData = await staticDataService.updateStaticData(
    req.params.id,
    data,
    imageUrl
  );
  res.status(200).json({ success: true, data: updatedStaticData });
});

exports.deleteStaticData = catchAsync(async (req, res) => {
  await staticDataService.deleteStaticData(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Static data deleted successfully" });
});
