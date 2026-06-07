/**
 * Order — patient places an order for one or more products.
 * Lifecycle: pending → paid → shipped → out-for-delivery → delivered
 *                                       ↘ cancelled
 */
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null, index: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
