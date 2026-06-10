/**
 * Payment controller (Stripe).
 *   POST /payments/intent    patient — create PaymentIntent for order or appointment
 *   POST /payments/confirm   patient — confirm after Stripe succeeds (or mock)
 */
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPatientByUser } = require('../utils/roleProfile');
const stripeService = require('../services/stripeService');

async function resolvePayable(type, refId, patient) {
  if (type === 'order') {
    const order = await Order.findById(refId);
    if (!order) throw new ApiError(404, 'Order not found');
    const orderPatientId = order.patientId?._id || order.patientId;
    if (orderPatientId.toString() !== patient._id.toString()) {
      throw new ApiError(403, 'This order does not belong to you');
    }
    if (order.status !== 'pending') {
      throw new ApiError(400, 'Order is not awaiting payment');
    }
    return { amount: order.totalAmount, ref: order, type: 'order' };
  }

  if (type === 'appointment') {
    const appt = await Appointment.findById(refId);
    if (!appt) throw new ApiError(404, 'Appointment not found');
    if (appt.patientId.toString() !== patient._id.toString()) {
      throw new ApiError(403, 'This appointment does not belong to you');
    }
    if (appt.paymentId) throw new ApiError(400, 'Appointment already paid');
    const doctor = await Doctor.findById(appt.doctorId);
    const amount = doctor?.consultationFee || 0;
    if (amount <= 0) throw new ApiError(400, 'No consultation fee set for this doctor');
    return { amount, ref: appt, type: 'appointment' };
  }

  throw new ApiError(400, 'Invalid payment type');
}

exports.createIntent = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') throw new ApiError(403, 'Only patients can create payments');

  const patient = await getPatientByUser(req.user._id);
  const { type, refId } = req.body;
  const payable = await resolvePayable(type, refId, patient);

  const existing = await Payment.findOne({
    type,
    refId,
    status: { $in: ['pending', 'succeeded'] },
  });
  if (existing?.status === 'succeeded') {
    throw new ApiError(400, 'Already paid');
  }

  const intent = await stripeService.createPaymentIntent({
    amount: payable.amount,
    metadata: { type, refId: refId.toString(), userId: req.user._id.toString() },
  });

  let payment = existing;
  if (payment) {
    payment.stripePaymentIntentId = intent.id;
    payment.amount = payable.amount;
    await payment.save();
  } else {
    payment = await Payment.create({
      userId: req.user._id,
      type,
      refId,
      amount: payable.amount,
      stripePaymentIntentId: intent.id,
      status: 'pending',
    });
  }

  res.json({
    success: true,
    data: {
      paymentId: payment._id,
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
      amount: payable.amount,
      mock: stripeService.isMockMode(),
    },
  });
});

exports.confirmPayment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') throw new ApiError(403, 'Forbidden');

  const { paymentIntentId } = req.body;
  const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden');
  }
  if (payment.status === 'succeeded') {
    return res.json({ success: true, message: 'Already confirmed.', data: payment });
  }

  const intent = await stripeService.retrievePaymentIntent(paymentIntentId);
  if (!stripeService.isMockMode() && intent.status !== 'succeeded') {
    throw new ApiError(400, 'Payment not completed yet');
  }

  payment.status = 'succeeded';
  await payment.save();

  if (payment.type === 'order') {
    const order = await Order.findById(payment.refId);
    if (order && order.status === 'pending') {
      order.status = 'paid';
      order.paymentId = payment._id;
      await order.save();
    }
  }

  if (payment.type === 'appointment') {
    const appt = await Appointment.findById(payment.refId);
    if (appt && !appt.paymentId) {
      appt.paymentId = payment._id;
      await appt.save();
    }
  }

  res.json({ success: true, message: 'Payment confirmed.', data: payment });
});
