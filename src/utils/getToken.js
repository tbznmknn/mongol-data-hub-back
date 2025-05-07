const axios = require("axios");
const schedule = require("node-schedule");
const AppError = require("./AppError");

exports.getToken = async () => {
  const requestBody = {
    email: process.env.BDS_BACK_username,
    password: process.env.BDS_BACK_password,
  };
  try {
    const response = await axios.post(
      `${process.env.BDS_BACK_BASE}/api/v1/users/login`,
      requestBody
    );
    const { token } = response.data;
    if (token) {
      return token;
    }
    throw new AppError("Failed to fetch token from bds_back");
  } catch (error) {
    console.error("Error fetching token:", error.message);
    throw new AppError("Error fetching token from bds_back", 500);
  }
  return null;
};
