/**
 * Wrap an async route handler so thrown errors propagate to the error middleware.
 * Usage: router.get('/x', asyncHandler(controller.x))
 */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
