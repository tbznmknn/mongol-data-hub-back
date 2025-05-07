const AppError = require("../utils/AppError");
const axios = require("axios");
exports.fetchData = async (url, options = {}) => {
  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    console.error("Error during request:", error.message);
    if (error.response) {
      console.error(
        "Response Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("No Response:", error.request);
    }
    throw new AppError(
      error.response.data.message || error.message || "Failed to fetch data",
      500
    );
    throw new AppError(error.message || "Failed to fetch data", 500);
  }
};
