const Joi = require('joi');

const orderItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
});

exports.createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  shippingAddress: Joi.string().trim().min(5).max(500).required(),
});

exports.updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'paid', 'shipped', 'out-for-delivery', 'delivered', 'cancelled')
    .required(),
});
