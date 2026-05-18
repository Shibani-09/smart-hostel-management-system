// Async error wrapper for express routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Standardized error response
const sendError = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error: error.message })
  });
};

// Standardized success response
const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data })
  });
};

module.exports = {
  asyncHandler,
  sendError,
  sendSuccess
};
