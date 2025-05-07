const catchAsync = require("../utils/catchAsync");
const memberService = require("../services/memberService");
const AppError = require("../utils/AppError");

exports.createMember = catchAsync(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("Please upload a photo", 400);
  }
  const imageUrl = req.file.filename; // Get uploaded file if exists

  const member = await memberService.createMember(req.body, imageUrl);
  res.status(201).json({
    success: true,
    data: member,
    message: "Member created successfully",
  });
});

exports.getMembers = catchAsync(async (req, res, next) => {
  const { members, pagination } = await memberService.getMembers(req.query);
  res.status(200).json({
    success: true,
    data: members,
    pagination,
  });
});

exports.getMemberDetail = catchAsync(async (req, res, next) => {
  const memberId = req.params.id;
  const member = await memberService.getMemberDetail(memberId);
  res.status(200).json({
    success: true,
    data: member,
  });
});

exports.updateMember = catchAsync(async (req, res, next) => {
  const memberId = req.params.id;
  const memberData = req.body;

  if (req.file) {
    memberData.picture = req.file.filename;
  }

  const updatedMember = await memberService.updateMember(memberId, memberData);

  res.status(200).json({
    success: true,
    message: "Member updated successfully",
    data: updatedMember,
  });
});

exports.deleteMember = catchAsync(async (req, res, next) => {
  const memberId = req.params.id;
  const deletedMember = await memberService.deleteMember(memberId);
  res.status(200).json({
    success: true,
    data: deletedMember,
    message: "Member deleted successfully",
  });
});
exports.getMemberKeys = catchAsync(async (req, res, next) => {
  const keys = await memberService.getMemberKeys();
  res.status(200).json({
    success: true,
    data: keys,
    message: "Keys fetched successfuly",
  });
});
