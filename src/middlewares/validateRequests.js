// middlewares/validateRequest.js
const validateRequest = (schema) => (req, res, next) => {
  try {
    // Validate body, query, and params against the schema
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next(); // Proceed if validation is successful
  } catch (error) {
    // Catch validation errors and send response
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: error.errors,
    });

    return next(
      new AppError({ success: false, message: error }, 400)
      //   new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
    );
  }
};

module.exports = validateRequest;
