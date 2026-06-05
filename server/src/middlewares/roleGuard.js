/**
 * roleGuard — restricts a route to specific roles.
 * Must be used AFTER the auth middleware.
 *
 *   router.get('/admin/users', auth, roleGuard('admin'), handler)
 *   router.get('/x', auth, roleGuard('admin', 'doctor'), handler)
 */
const ApiError = require('../utils/ApiError');

module.exports = function roleGuard(...allowed) {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!allowed.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden: requires one of [${allowed.join(', ')}]`));
    }
    next();
  };
};
