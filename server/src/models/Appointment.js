/**
 * Appointment — booking of a patient with a doctor at a specific time.
 */
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g. "10:00-10:30"
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    reason: { type: String, default: '' },
    notes: { type: String, default: '' }, // doctor-only
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
