/**
 * Centralized HTTP error handler.
 * Includes optional validation details and suppresses noisy logs in test mode.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Attach validation details if present
  if (err.details) {
    response.details = err.details;
  }

  if (statusCode === 500 && process.env.NODE_ENV !== 'test') {
    console.error('[Server Error]', err);
  }

  res.status(statusCode).json(response);
}

/**
 * Handles unmatched routes.
 */
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

module.exports = { errorHandler, notFound };
