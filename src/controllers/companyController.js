const companyService = require("../services/companyService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createCompany = catchAsync(async (req, res) => {
  if (!req.file) {
    console.log(req.file);
    throw new AppError("No image uploaded.", 400);
  }

  const imageUrl = req.file.filename; // Store only one image filename
  const newCompany = await companyService.createCompany(
    req.body,
    imageUrl,
    req.userId
  );
  res.status(201).json({ success: true, data: newCompany });
});

exports.getCompanies = catchAsync(async (req, res) => {
  const { companies, pagination } = await companyService.getCompanies(
    req.query
  );
  res.status(200).json({ success: true, data: companies, pagination });
});

exports.getCompanyDetail = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyDetail(req.params.id);
  res.status(200).json({ success: true, data: company });
});

exports.updateCompany = catchAsync(async (req, res) => {
  const imageUrl = req.file ? req.file.filename : null; // Get uploaded file if exists

  const updatedCompany = await companyService.updateCompany(
    req.params.id,
    req.body,
    imageUrl,
    req.userId
  );
  res.status(200).json({ success: true, data: updatedCompany });
});

exports.deleteCompany = catchAsync(async (req, res) => {
  await companyService.deleteCompany(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Company deleted successfully" });
});
exports.getOverview = catchAsync(async (req, res) => {
  const data = await companyService.getOverview(req.query);
  res.status(200).json({ success: true, data });
});
exports.getOverviewAdmin = catchAsync(async (req, res) => {
  const data = await companyService.getOverviewAdmin(req.query);
  res.status(200).json({ success: true, data });
});
exports.getOccupationKeys = catchAsync(async (req, res) => {
  const data = await companyService.getOccupationKeys();
  res.status(200).json({ success: true, data });
});
exports.getAffiliationKeys = catchAsync(async (req, res) => {
  const data = await companyService.getAffiliationKeys();
  res.status(200).json({ success: true, data });
});
