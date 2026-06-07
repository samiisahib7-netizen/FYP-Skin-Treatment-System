/**
 * Report — medical report / lab result uploaded by doctor or admin for a patient.
 * Files are stored in server/uploads/reports/; fileUrl is the public path.
 */
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'image'], default: 'pdf' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
