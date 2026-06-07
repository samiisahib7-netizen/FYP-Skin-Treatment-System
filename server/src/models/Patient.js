/**
 * Patient model — extends User with patient-specific fields.
 * Created either via self-registration (Module 1) or by Admin.
 */
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ['male', 'female', 'other', null], default: null },
    address: { type: String, default: '' },
    medicalHistory: { type: String, default: '' },
    allergies: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
