const Joi = require('joi');
const { emailRule } = require('./common');
const passwordRule = Joi.string().min(8).max(128).required();

const slotSchema = Joi.object({
  start: Joi.string().required(),
  end: Joi.string().required(),
  isBooked: Joi.boolean().default(false),
});

const availabilitySchema = Joi.object({
  day: Joi.string().valid('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun').required(),
  slots: Joi.array().items(slotSchema).default([]),
});

exports.createDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: emailRule.required(),
  password: passwordRule,
  phone: Joi.string().allow(''),
  specialization: Joi.string().required(),
  qualification: Joi.string().allow('').default(''),
  experience: Joi.number().min(0).default(0),
  consultationFee: Joi.number().min(0).default(0),
  availability: Joi.array().items(availabilitySchema).default([]),
  bio: Joi.string().allow('').default(''),
});

exports.updateDoctorSchema = Joi.object({
  name: Joi.string().min(2).max(80),
  phone: Joi.string().allow(''),
  specialization: Joi.string(),
  qualification: Joi.string().allow(''),
  experience: Joi.number().min(0),
  consultationFee: Joi.number().min(0),
  availability: Joi.array().items(availabilitySchema),
  bio: Joi.string().allow(''),
});
