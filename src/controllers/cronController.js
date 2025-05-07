const catchAsync = require("../utils/catchAsync");
const { syncBonds } = require("../services/bondServices");
const { syncTradingStatus } = require("../services/securityServices");
const cronServices = require("../services/cronServices");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
const {
  syncOtcBonds,
  syncOtcTransactionHistory,
  syncOtcFiles,
} = require("../services/externalServices");

exports.syncMseBonds = catchAsync(async (req, res, next) => {
  const result = await syncBonds();
  return res.status(200).json({
    success: true,
    data: result,
    message: "Амжилттай авлаа",
  });
});
exports.syncTradingStatus = catchAsync(async (req, res, next) => {
  const result = await syncTradingStatus();
  return res.status(200).json({
    success: true,
    data: result,
    message: "Амжилттай авлаа",
  });
});
exports.syncAllOtcBond = catchAsync(async (req, res, next) => {
  const result = await syncOtcBonds();
  const b = await syncOtcTransactionHistory();
  const a = await syncOtcFiles();
  return res.status(200).json({
    success: true,
    data: result,
    message: "Амжилттай авлаа",
  });
});

// exports.getUsers = catchAsync(async (req, res, next) => {
//   const { users, pagination } = await bondServices.getUsers(
//     req.userId,
//     req.query
//   );
//   return res.status(200).json({
//     success: true,
//     data: users,
//     pagination,
//     message: "Амжилттай авлаа",
//   });
// });
// exports.getUserDetailByAdmin = catchAsync(async (req, res, next) => {
//   const user = await bondServices.getUserDetail(parseInt(req.params.id));
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Амжилттай авлаа",
//   });
// });
// exports.getUserDetailBySameUser = catchAsync(async (req, res, next) => {
//   const user = await bondServices.getUserDetail(req.userId);
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Амжилттай авлаа",
//   });
// });
// exports.editUserDetailsBySameUser = catchAsync(async (req, res, next) => {
//   const user = await bondServices.editUserDetails(req.userId, req.body);
//   return res.status(200).json({
//     success: true,
//     data: user,
//     message: "Амжилттай хэрэглэгчийн мэдээлэл шинэчлэгдлээ",
//   });
// });
