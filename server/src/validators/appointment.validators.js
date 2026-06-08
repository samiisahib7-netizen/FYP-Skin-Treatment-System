const Joi = require('joi');

exports.createAppointmentSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  timeSlot: Joi.string().trim().required(),
  reason: Joi.string().allow('').default(''),
});

exports.updateStatusSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'completed', 'cancelled').required(),
});

exports.updateNotesSchema = Joi.object({
  notes: Joi.string().allow('').required(),
});
