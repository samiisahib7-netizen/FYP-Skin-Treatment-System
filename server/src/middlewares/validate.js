/**
 * validate — runs a Joi schema on req.body (or req.params / req.query if specified).
 * On failure, throws a 400 ApiError with a `details` object.
 */
const ApiError = require('../utils/ApiError');

module.exports = function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      const details = {};
      for (const detail of error.details) {
        const key = detail.path.join('.') || '_';
        if (!details[key]) details[key] = detail.message;
      }
      return next(new ApiError(400, 'Validation failed', details));
    }
    req[source] = value;
    next();
  };
};
