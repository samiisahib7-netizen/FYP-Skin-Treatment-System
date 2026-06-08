const Joi = require('joi');

const medicineSchema = Joi.object({
  name: Joi.string().trim().required(),
  dosage: Joi.string().allow('').default(''),
  duration: Joi.string().allow('').default(''),
  instructions: Joi.string().allow('').default(''),
});

exports.createPrescriptionSchema = Joi.object({
  appointmentId: Joi.string().hex().length(24).required(),
  medicines: Joi.array().items(medicineSchema).min(1).required(),
  advice: Joi.string().allow('').default(''),
  followUpDate: Joi.date().iso().allow(null),
});
