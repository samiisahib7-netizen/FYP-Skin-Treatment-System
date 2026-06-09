/**
 * optionalAuth — attaches req.user when a valid Bearer token is present.
 */
const auth = require('./auth');

module.exports = function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next();
  return auth(req, res, next);
};
