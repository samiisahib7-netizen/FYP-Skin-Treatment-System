const Joi = require('joi');

const createReviewSchema = Joi.object({
  targetType: Joi.string().valid('doctor', 'product').required(),
  targetId: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow('').optional(),
  appointmentId: Joi.string().hex().length(24).optional(),
});

const listReviewsQuerySchema = Joi.object({
  targetType: Joi.string().valid('doctor', 'product').required(),
  targetId: Joi.string().hex().length(24).required(),
});

module.exports = { createReviewSchema, listReviewsQuerySchema };
