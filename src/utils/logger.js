const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { combine, printf, errors } = format;

// Custom log format (with milliseconds)
const logFormat = printf(({ level, message, stack, userId }) => {
  const timestamp = new Date();

  // Adjust for Ulaanbaatar's time zone (UTC+8)
  const utcOffset = 8 * 60 * 60 * 1000; // Offset in milliseconds
  const localTimestamp = new Date(timestamp.getTime() + utcOffset);

  // Create a timestamp string with milliseconds
  const formattedTimestamp = `${
    localTimestamp.toISOString().split(".")[0]
  }.${localTimestamp.getMilliseconds().toString().padStart(3, "0")}+08:00`; // ISO format with milliseconds and UTC+8

  return JSON.stringify({
    level,
    message: stack ? stack : message,
    timestamp: formattedTimestamp,
    userId: "teststestset",
  });
});

// Create logger instance
const logger = createLogger({
  format: combine(
    errors({ stack: true }), // Include stack traces in error logs
    logFormat // Use minimal JSON format with custom timestamp
  ),
  transports: [
    // Daily rotate for access logs (info level)
    new DailyRotateFile({
      filename: "logs/%DATE%_combined.log",
      datePattern: "YYYY-MM-DD",
      level: "info", // Log info level for access logs
      maxFiles: "14d", // Keep logs for 14 days
    }),
    // Daily rotate for error logs (error level)
    new DailyRotateFile({
      filename: "logs/%DATE%_error.log",
      datePattern: "YYYY-MM-DD",
      level: "error", // Log error level separately
      maxFiles: "14d", // Keep error logs for 14 days
    }),
  ],
});

// Error handling for uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  // console.log(err.message);
  // const exception = "Uncaught Exception! " + err.stack;
  console.error("Uncaught Exception! " + err.stack);
  // console.error("Uncaught Exception!", err.stack.toString());
  logger.error("Uncaught Exception! " + err.stack);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! " + err.stack);
  logger.error("Unhandled Rejection!" + err.stack);
});

const consoleEndpointLogger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.hostname}${req.originalUrl}`.cyan
  );
  next();
};

module.exports = { logger, consoleEndpointLogger };
