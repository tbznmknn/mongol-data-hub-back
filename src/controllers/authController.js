const catchAsync = require("../utils/catchAsync");
const authServices = require("../services/authServices");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
const { createLogger } = require("winston");
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await authServices.createUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});
exports.createTestUser = catchAsync(async (req, res, next) => {
  const user = await authServices.createTestUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});
exports.loginWithCredentials = catchAsync(async (req, res, next) => {
  const sessionId = req.cookies.sessionId || null;
  const user = await authServices.loginWithCredentials(req.body, sessionId);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await authServices.changePassword(req.userId, req.body);
  return res.status(200).json({
    success: true,
    message: "Нууц үг амжилттай солигдлоо",
  });
});
exports.changeUserRole = catchAsync(async (req, res, next) => {
  const sessionId = req.cookies.sessionId || null;
  const user = await authServices.changeUserRole(req.userId, req.body);
  return res.status(200).json({
    success: true,
    data: user,
    message: "Хэрэглэгчийн эрх амжилттай солигдлоо",
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await authServices.deleteUser(req.userId, req.body);
  return res.status(200).json({
    success: true,
    data: user,
    message: "Хэрэглэгч амжилттай устгагдлаа",
  });
});
exports.register = catchAsync(async (req, res, next) => {
  const user = await authServices.register(req.body);
  return res.status(200).json({
    success: true,
    data: user,
    message: "Хэрэглэгч амжилттай бүртгэгдлээ",
  });
});
exports.sendConfirmationLink = catchAsync(async (req, res, next) => {
  const result = await authServices.sendConfirmationLink(req.body);
  return res.status(200).json({
    success: true,
    data: result,
    message: "Амжилттай",
  });
});
exports.confirmToken = catchAsync(async (req, res, next) => {
  const result = await authServices.confirmToken(req.query);
  return res.status(200).json({
    success: true,
    data: result,
    message: "Амжилттай",
  });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const result = await authServices.forgotPassword(req.body);
  return res.status(200).json({
    success: true,
    data: result,
    message: "Амжилттай",
  });
});
