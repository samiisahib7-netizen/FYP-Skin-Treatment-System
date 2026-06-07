/**
 * Review — patient rates a doctor or a product.
 */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    targetType: { type: String, enum: ['doctor', 'product'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
