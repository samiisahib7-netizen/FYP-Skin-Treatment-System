/**
 * Doctor model — extends User with dermatologist-specific fields.
 * Created by Admin via POST /doctors.
 */
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    start: { type: String, required: true }, // "10:00"
    end: { type: String, required: true },   // "10:30"
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      required: true,
    },
    slots: [slotSchema],
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    specialization: { type: String, required: [true, 'Specialization is required'], trim: true },
    qualification: { type: String, default: '' },
    experience: { type: Number, min: 0, default: 0 },
    consultationFee: { type: Number, min: 0, default: 0 },
    availability: { type: [availabilitySchema], default: [] },
    bio: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
