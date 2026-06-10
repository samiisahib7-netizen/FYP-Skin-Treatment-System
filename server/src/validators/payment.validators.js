const Joi = require('joi');

exports.createIntentSchema = Joi.object({
  type: Joi.string().valid('order', 'appointment').required(),
  refId: Joi.string().hex().length(24).required(),
});

exports.confirmPaymentSchema = Joi.object({
  paymentIntentId: Joi.string().required(),
});
