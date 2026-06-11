/**
 * Appointment controller.
 *   GET    /appointments              patient | doctor | admin
 *   GET    /appointments/:id          owner roles
 *   POST   /appointments              patient
 *   PATCH  /appointments/:id/status   doctor | admin
 *   PUT    /appointments/:id          doctor (notes)
 */
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPatientByUser, getDoctorByUser } = require('../utils/roleProfile');
const { createNotification } = require('../services/notificationService');

const POPULATE = [
  { path: 'patientId', populate: { path: 'userId', select: '-password' } },
  { path: 'doctorId', populate: { path: 'userId', select: '-password' } },
];

/** Normalize date to UTC midnight for consistent day matching */
function dayStart(d) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

async function enrichAppointment(doc) {
  const a = doc.toObject ? doc.toObject() : { ...doc };
  const patient = await Patient.findById(a.patientId).populate('userId', '-password');
  const doctor = await Doctor.findById(a.doctorId).populate('userId', '-password');
  return { ...a, patient, doctor };
}

async function assertCanViewAppointment(req, appointment) {
  const role = req.user.role;
  if (role === 'admin') return;

  if (role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || appointment.patientId.toString() !== patient._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return;
  }

  if (role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return;
  }

  throw new ApiError(403, 'Forbidden');
}

exports.listAppointments = asyncHandler(async (req, res) => {
  const { status, date } = req.query;
  const q = {};

  if (status) q.status = status;
  if (date) {
    const start = dayStart(date);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    q.date = { $gte: start, $lt: end };
  }

  const role = req.user.role;
  if (role === 'patient') {
    const patient = await getPatientByUser(req.user._id);
    q.patientId = patient._id;
  } else if (role === 'doctor') {
    const doctor = await getDoctorByUser(req.user._id);
    q.doctorId = doctor._id;
  }
  // admin: no extra filter

  const items = await Appointment.find(q).sort('-date').populate(POPULATE);
  res.json({ success: true, data: items });
});

exports.getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(POPULATE);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  await assertCanViewAppointment(req, appointment);
  res.json({ success: true, data: appointment });
});

exports.createAppointment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'patient') throw new ApiError(403, 'Only patients can book appointments');

  const patient = await getPatientByUser(req.user._id);
  const { doctorId, date, timeSlot, reason } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, 'Doctor not found');

  const apptDate = dayStart(date);
  const conflict = await Appointment.findOne({
    doctorId,
    date: apptDate,
    timeSlot,
    status: { $ne: 'cancelled' },
  });
  if (conflict) throw new ApiError(409, 'This time slot is already booked');

  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorId,
    date: apptDate,
    timeSlot,
    reason: reason || '',
    status: 'pending',
  });

  const data = await enrichAppointment(await Appointment.findById(appointment._id));

  const doctorUserId = doctor.userId;
  await createNotification(doctorUserId, {
    type: 'appointment',
    title: 'New appointment request',
    message: `A patient booked ${timeSlot} on ${apptDate.toDateString()}.`,
    meta: { appointmentId: appointment._id },
  });

  res.status(201).json({ success: true, message: 'Appointment booked.', data });
});

const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

exports.updateStatus = asyncHandler(async (req, res) => {
  if (!['doctor', 'admin'].includes(req.user.role)) {
    throw new ApiError(403, 'Only doctors or admins can update appointment status');
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');

  if (req.user.role === 'doctor') {
    const doctor = await getDoctorByUser(req.user._id);
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      throw new ApiError(403, 'You can only manage your own appointments');
    }
  }

  const { status } = req.body;
  const allowed = ALLOWED_TRANSITIONS[appointment.status] || [];
  if (!allowed.includes(status)) {
    throw new ApiError(400, `Cannot change status from '${appointment.status}' to '${status}'`);
  }

  appointment.status = status;
  await appointment.save();

  const patient = await Patient.findById(appointment.patientId).populate('userId', 'name');
  if (patient?.userId) {
    const labels = {
      confirmed: 'confirmed',
      completed: 'marked as completed',
      cancelled: 'cancelled',
    };
    if (labels[status]) {
      await createNotification(patient.userId._id, {
        type: 'appointment',
        title: 'Appointment update',
        message: `Your appointment on ${new Date(appointment.date).toDateString()} was ${labels[status]}.`,
        meta: { appointmentId: appointment._id, status },
      });
    }
  }

  const data = await Appointment.findById(appointment._id).populate(POPULATE);
  res.json({ success: true, message: 'Status updated.', data });
});

exports.updateNotes = asyncHandler(async (req, res) => {
  if (req.user.role !== 'doctor') throw new ApiError(403, 'Only doctors can update notes');

  const doctor = await getDoctorByUser(req.user._id);
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  if (appointment.doctorId.toString() !== doctor._id.toString()) {
    throw new ApiError(403, 'You can only update notes on your own appointments');
  }

  appointment.notes = req.body.notes;
  await appointment.save();

  const data = await Appointment.findById(appointment._id).populate(POPULATE);
  res.json({ success: true, message: 'Notes updated.', data });
});
