/**
 * Rider model — extends User with delivery-agent fields.
 * Created by Admin via POST /riders.
 */
const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    vehicleNo: { type: String, default: '' },
    area: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rider', riderSchema);
