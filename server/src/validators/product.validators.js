const Joi = require('joi');

exports.createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().allow('').default(''),
  category: Joi.string().allow('').default('general'),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  brand: Joi.string().allow('').default(''),
  isActive: Joi.boolean().default(true),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  description: Joi.string().allow(''),
  category: Joi.string().allow(''),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  brand: Joi.string().allow(''),
  isActive: Joi.boolean(),
});
