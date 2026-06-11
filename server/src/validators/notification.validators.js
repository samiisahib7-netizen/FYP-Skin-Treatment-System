const Joi = require('joi');

const listQuerySchema = Joi.object({
  unreadOnly: Joi.string().valid('true', 'false').optional(),
});

module.exports = { listQuerySchema };
