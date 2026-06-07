/**
 * Payment — polymorphic: refId points to an Appointment or Order.
 */
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['appointment', 'order'], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, default: 'stripe' },
    stripePaymentIntentId: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
      index: true,
    },
    receiptUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
