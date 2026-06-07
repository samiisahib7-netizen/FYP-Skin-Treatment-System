const Joi = require('joi');
const { ROLES } = require('../models/User');

const passwordRule = Joi.string().min(8).max(128).required();

exports.updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().allow(''),
  role: Joi.string().valid(...ROLES),
  isActive: Joi.boolean(),
});

exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  phone: Joi.string().allow(''),
  avatar: Joi.string().uri().allow(''),
});
