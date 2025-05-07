const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { createLogger } = require("winston");
exports.protect = catchAsync(async (req, res, next) => {
  //   req.userId = null;
  //   req.userRole = null;
  //   req.email = null;

  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError("TOKEN оруулна уу", 401);
  }
  const tokenObj = jwt.verify(
    token,
    process.env.AUTH_SECRET,
    (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError("TOKEN expired", 401);
        }
        throw new AppError("Invalid TOKEN", 401);
      }
      return decoded;
    }
  );
  //REQ obj дээр хэрэглэгчийн мэдээлэл хадгалаад дараагийн middleware функц руу
  //дараах хувьсагчтайгаа шилжинэ. (Re-usable variables)
  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;
  req.email = tokenObj.email;
  console.log("auth");
  next();
});
exports.passAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    req.userId = null;
    req.userRole = null;
    req.email = null;
    console.log("no token");
    return next();
  }
  const tokenObj = jwt.verify(
    token,
    process.env.AUTH_SECRET,
    (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError("TOKEN expired", 401);
        }
        throw new AppError("Invalid TOKEN", 401);
      }
      return decoded;
    }
  );
  //REQ obj дээр хэрэглэгчийн мэдээлэл хадгалаад дараагийн middleware функц руу
  //дараах хувьсагчтайгаа шилжинэ. (Re-usable variables)
  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;
  req.email = tokenObj.email;
  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new AppError(
        "Your [" +
          req.userRole +
          "] permission has been denied to do this action",
        403
      );
    }
    next();
  };
};
