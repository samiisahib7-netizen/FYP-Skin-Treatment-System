const Joi = require('joi');
const { emailRule } = require('./common');
const passwordRule = Joi.string().min(8).max(128).required();

exports.createRiderSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: emailRule.required(),
  password: passwordRule,
  phone: Joi.string().allow(''),
  vehicleNo: Joi.string().allow('').default(''),
  area: Joi.string().allow('').default(''),
});

exports.updateRiderSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  phone: Joi.string().allow(''),
  vehicleNo: Joi.string().allow(''),
  area: Joi.string().allow(''),
  isAvailable: Joi.boolean(),
});
