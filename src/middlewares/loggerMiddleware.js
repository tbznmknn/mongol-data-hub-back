const morgan = require("morgan");
const { logger } = require("../utils/logger");

// Create a stream for Morgan that uses Winston’s logger for 'info' level
const stream = {
  write: (message) => {
    // Log HTTP access requests at 'info' level
    logger.info(message.trim());
  },
};

// Skip logging for certain environments (e.g., testing)
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "test"; // Skip logging during tests
};
morgan.token("filtered-body", (req) => {
  const { password, confirmPassword, ...filteredBody } = req.body || {};
  return JSON.stringify(filteredBody);
});
// Use Morgan to log HTTP requests with custom format
const morganMiddleware = morgan(
  ":method :url :status - :response-time ms - IP: :remote-addr - User-Agent: :user-agent Body: :filtered-body",
  { stream, skip }
);

module.exports = morganMiddleware;
