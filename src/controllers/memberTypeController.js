const catchAsync = require("../utils/catchAsync");
const memberTypeService = require("../services/memberTypeService");

exports.createMemberType = catchAsync(async (req, res, next) => {
  const memberType = await memberTypeService.createMemberType(req.body);
  res.status(201).json({
    success: true,
    data: memberType,
    message: "Member Type created successfully",
  });
});

exports.getMemberTypes = catchAsync(async (req, res, next) => {
  const { memberTypes, pagination } = await memberTypeService.getMemberTypes(
    req.query
  );
  res.status(200).json({
    success: true,
    data: memberTypes,
    pagination,
  });
});

exports.getMemberTypeDetail = catchAsync(async (req, res, next) => {
  const memberTypeId = req.params.id;
  const memberType = await memberTypeService.getMemberTypeDetail(memberTypeId);
  res.status(200).json({
    success: true,
    data: memberType,
  });
});

exports.updateMemberType = catchAsync(async (req, res, next) => {
  const memberTypeId = req.params.id;
  const updatedMemberType = await memberTypeService.updateMemberType(
    memberTypeId,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Member Type updated successfully",
    data: updatedMemberType,
  });
});

exports.deleteMemberType = catchAsync(async (req, res, next) => {
  const memberTypeId = req.params.id;
  const deletedMemberType = await memberTypeService.deleteMemberType(
    memberTypeId
  );
  res.status(200).json({
    success: true,
    data: deletedMemberType,
    message: "Member Type deleted successfully",
  });
});
