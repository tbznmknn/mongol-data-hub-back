// const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");
// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  // Log the error details using Winston
  // If status code is 500, then it should be logged. and shown in terminal.
  if (statusCode === 500) {
    console.log("errorHandler caught an error:\n", err.stack);
    logger.error({
      message: err.message,
      statusCode,
      stack: err.stack,
    });
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
