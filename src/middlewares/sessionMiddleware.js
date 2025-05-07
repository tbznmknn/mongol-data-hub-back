const { v4: uuidv4 } = require("uuid"); // To generate a unique session ID
const sessionMiddleware = (req, res, next) => {
  if (!req.cookies.sessionId) {
    const sessionId = uuidv4(); // Generate a new session ID
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }); // 30 days
  } else {
    // console.log(req.cookies.sessionId);
  }
  next();
};
module.exports = sessionMiddleware;
