/**
 * Custom API Error class — carries an HTTP status code.
 * Throw it from controllers; the error handler middleware will format the response.
 */
class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

module.exports = ApiError;
