const Joi = require('joi');

exports.createReportSchema = Joi.object({
  patientId: Joi.string().hex().length(24).required(),
  title: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().allow('').default(''),
  appointmentId: Joi.alternatives()
    .try(Joi.string().hex().length(24), Joi.valid('', null))
    .optional(),
});
