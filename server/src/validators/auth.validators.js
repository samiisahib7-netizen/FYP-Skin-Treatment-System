/**
 * Joi validation schemas for /auth endpoints.
 */
const Joi = require('joi');

const passwordRule = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/[0-9]/, 'number')
  .required()
  .messages({
    'string.pattern.name': 'Password must contain at least one {#name} character',
    'any.required': 'Password is required',
  });

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: passwordRule,
  // Allow admin to seed a doctor/rider by passing role; default = patient
  role: Joi.string().valid('admin', 'doctor', 'patient', 'rider').default('patient'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  password: passwordRule,
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordRule,
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
