const catchAsync = require("../utils/catchAsync");
const affiliationTypeService = require("../services/affiliationTypeService");

exports.createAffiliationType = catchAsync(async (req, res, next) => {
  const affiliationType = await affiliationTypeService.createAffiliationType(
    req.body
  );
  res.status(201).json({
    success: true,
    data: affiliationType,
    message: "Affiliation Type created successfully",
  });
});

exports.getAffiliationTypes = catchAsync(async (req, res, next) => {
  const { affiliationTypes, pagination } =
    await affiliationTypeService.getAffiliationTypes(req.query);
  res.status(200).json({
    success: true,
    data: affiliationTypes,
    pagination,
  });
});

exports.getAffiliationTypeDetail = catchAsync(async (req, res, next) => {
  const affiliationTypeId = req.params.id;
  const affiliationType = await affiliationTypeService.getAffiliationTypeDetail(
    affiliationTypeId
  );
  res.status(200).json({
    success: true,
    data: affiliationType,
  });
});

exports.updateAffiliationType = catchAsync(async (req, res, next) => {
  const affiliationTypeId = req.params.id;
  const updatedAffiliationType =
    await affiliationTypeService.updateAffiliationType(
      affiliationTypeId,
      req.body
    );
  res.status(200).json({
    success: true,
    message: "Affiliation Type updated successfully",
    data: updatedAffiliationType,
  });
});

exports.deleteAffiliationType = catchAsync(async (req, res, next) => {
  const affiliationTypeId = req.params.id;
  const deletedAffiliationType =
    await affiliationTypeService.deleteAffiliationType(affiliationTypeId);
  res.status(200).json({
    success: true,
    data: deletedAffiliationType,
    message: "Affiliation Type deleted successfully",
  });
});
