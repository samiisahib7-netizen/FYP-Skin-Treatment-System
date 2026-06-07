const Joi = require('joi');
const passwordRule = Joi.string().min(8).max(128).required();

exports.createPatientSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: passwordRule,
  phone: Joi.string().allow(''),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid('male', 'female', 'other'),
  address: Joi.string().allow('').default(''),
  medicalHistory: Joi.string().allow('').default(''),
  allergies: Joi.array().items(Joi.string()).default([]),
});

exports.updatePatientSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  phone: Joi.string().allow(''),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid('male', 'female', 'other'),
  address: Joi.string().allow(''),
  medicalHistory: Joi.string().allow(''),
  allergies: Joi.array().items(Joi.string()),
});
