const catchAsync = require("../utils/catchAsync");
const occupationTypeService = require("../services/occupationTypeService");

exports.createOccupationType = catchAsync(async (req, res, next) => {
  const occupationType = await occupationTypeService.createOccupationType(
    req.body
  );
  res.status(201).json({
    success: true,
    data: occupationType,
    message: "Occupation Type created successfully",
  });
});

exports.getOccupationTypes = catchAsync(async (req, res, next) => {
  const { occupationTypes, pagination } =
    await occupationTypeService.getOccupationTypes(req.query);
  res.status(200).json({
    success: true,
    data: occupationTypes,
    pagination,
  });
});

exports.getOccupationTypeDetail = catchAsync(async (req, res, next) => {
  const occupationTypeId = req.params.id;
  const occupationType = await occupationTypeService.getOccupationTypeDetail(
    occupationTypeId
  );
  res.status(200).json({
    success: true,
    data: occupationType,
  });
});

exports.updateOccupationType = catchAsync(async (req, res, next) => {
  const occupationTypeId = req.params.id;
  const updatedOccupationType =
    await occupationTypeService.updateOccupationType(
      occupationTypeId,
      req.body
    );
  res.status(200).json({
    success: true,
    message: "Occupation Type updated successfully",
    data: updatedOccupationType,
  });
});

exports.deleteOccupationType = catchAsync(async (req, res, next) => {
  const occupationTypeId = req.params.id;
  const deletedOccupationType =
    await occupationTypeService.deleteOccupationType(occupationTypeId);
  res.status(200).json({
    success: true,
    data: deletedOccupationType,
    message: "Occupation Type deleted successfully",
  });
});
