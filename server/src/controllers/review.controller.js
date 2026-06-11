/**
 * Review controller.
 *   GET    /reviews              list by targetType + targetId (public)
 *   GET    /reviews/mine         patient — own reviews
 *   POST   /reviews              patient
 *   DELETE /reviews/:id          patient (own) | admin
 */
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Order = require('../models/Order');
const Patient = require('../models/Patient');
const Product = require('../models/Product');
const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPatientByUser } = require('../utils/roleProfile');

const POPULATE = { path: 'patientId', populate: { path: 'userId', select: 'name' } };

async function updateTargetRating(targetType, targetId) {
  const reviews = await Review.find({ targetType, targetId });
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const rounded = Math.round(avg * 10) / 10;
  if (targetType === 'doctor') {
    await Doctor.findByIdAndUpdate(targetId, { rating: rounded, totalReviews: total });
  } else {
    await Product.findByIdAndUpdate(targetId, { rating: rounded, totalReviews: total });
  }
}

exports.listReviews = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;
  if (!targetType || !targetId) {
    throw new ApiError(400, 'targetType and targetId are required');
  }

  const items = await Review.find({ targetType, targetId }).sort('-createdAt').populate(POPULATE);
  res.json({ success: true, data: items });
});

exports.myReviews = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') throw new ApiError(403, 'Only patients have personal reviews');

  const patient = await getPatientByUser(req.user._id);
  const items = await Review.find({ patientId: patient._id }).sort('-createdAt');
  res.json({ success: true, data: items });
});

exports.createReview = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') throw new ApiError(403, 'Only patients can submit reviews');

  const patient = await getPatientByUser(req.user._id);
  const { targetType, targetId, rating, comment, appointmentId } = req.body;

  if (targetType === 'doctor') {
    const doctor = await Doctor.findById(targetId);
    if (!doctor) throw new ApiError(404, 'Doctor not found');

    if (appointmentId) {
      const appt = await Appointment.findById(appointmentId);
      if (!appt || appt.patientId.toString() !== patient._id.toString()) {
        throw new ApiError(400, 'Invalid appointment for this review');
      }
      if (appt.status !== 'completed') {
        throw new ApiError(400, 'You can only review after a completed appointment');
      }
      if (appt.doctorId.toString() !== targetId) {
        throw new ApiError(400, 'Appointment does not match this doctor');
      }
    }
  } else if (targetType === 'product') {
    const product = await Product.findById(targetId);
    if (!product) throw new ApiError(404, 'Product not found');

    const delivered = await Order.findOne({
      patientId: patient._id,
      status: 'delivered',
      'items.productId': targetId,
    });
    if (!delivered) {
      throw new ApiError(400, 'You can review a product after it has been delivered to you');
    }
  } else {
    throw new ApiError(400, 'Invalid target type');
  }

  const duplicate = await Review.findOne({ patientId: patient._id, targetType, targetId });
  if (duplicate) throw new ApiError(409, 'You have already reviewed this item');

  const review = await Review.create({
    patientId: patient._id,
    targetType,
    targetId,
    rating,
    comment: comment || '',
    appointmentId: appointmentId || null,
  });

  await updateTargetRating(targetType, targetId);

  res.status(201).json({ success: true, message: 'Review submitted.', data: review });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || review.patientId.toString() !== patient._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
  } else if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  const { targetType, targetId } = review;
  await review.deleteOne();
  await updateTargetRating(targetType, targetId);

  res.json({ success: true, message: 'Review deleted.' });
});
