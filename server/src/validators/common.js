/**
 * Shared Joi field rules — allows dev TLDs like .local used in seed data.
 */
const Joi = require('joi');

const emailRule = Joi.string().email({ tlds: { allow: false } }).lowercase().trim();

module.exports = { emailRule };
