/**
 * Prescription controller.
 *   GET    /prescriptions                        patient | doctor | admin
 *   GET    /prescriptions/appointment/:id        patient | doctor
 *   GET    /prescriptions/:id                    patient | doctor | admin
 *   POST   /prescriptions                        doctor
 */
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getDoctorByUser, getPatientByUser } = require('../utils/roleProfile');

const POPULATE = [
  { path: 'appointmentId' },
  { path: 'patientId', populate: { path: 'userId', select: '-password' } },
  { path: 'doctorId', populate: { path: 'userId', select: '-password' } },
];

async function assertCanViewPrescription(req, rx) {
  const role = req.user.role;
  if (role === 'admin') return;

  if (role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || rx.patientId.toString() !== patient._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return;
  }

  if (role === 'doctor') {
    const doctor = await getDoctorByUser(req.user._id);
    if (rx.doctorId.toString() !== doctor._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return;
  }

  throw new ApiError(403, 'Forbidden');
}

exports.listPrescriptions = asyncHandler(async (req, res) => {
  const q = {};
  const role = req.user.role;

  if (role === 'patient') {
    const patient = await getPatientByUser(req.user._id);
    q.patientId = patient._id;
  } else if (role === 'doctor') {
    const doctor = await getDoctorByUser(req.user._id);
    q.doctorId = doctor._id;
  }

  const items = await Prescription.find(q).sort('-issuedAt').populate(POPULATE);
  res.json({ success: true, data: items });
});

exports.getByAppointment = asyncHandler(async (req, res) => {
  const rx = await Prescription.findOne({ appointmentId: req.params.appointmentId }).populate(POPULATE);
  if (!rx) throw new ApiError(404, 'No prescription for this appointment');

  await assertCanViewPrescription(req, rx);
  res.json({ success: true, data: rx });
});

exports.getPrescription = asyncHandler(async (req, res) => {
  const rx = await Prescription.findById(req.params.id).populate(POPULATE);
  if (!rx) throw new ApiError(404, 'Prescription not found');
  await assertCanViewPrescription(req, rx);
  res.json({ success: true, data: rx });
});

exports.createPrescription = asyncHandler(async (req, res) => {
  if (req.user.role !== 'doctor') throw new ApiError(403, 'Only doctors can create prescriptions');

  const doctor = await getDoctorByUser(req.user._id);
  const { appointmentId, medicines, advice, followUpDate } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  if (appointment.doctorId.toString() !== doctor._id.toString()) {
    throw new ApiError(403, 'This appointment is not assigned to you');
  }
  if (appointment.status !== 'completed') {
    throw new ApiError(400, 'Prescription can only be created for completed appointments');
  }

  const existing = await Prescription.findOne({ appointmentId });
  if (existing) throw new ApiError(409, 'A prescription already exists for this appointment');

  const rx = await Prescription.create({
    appointmentId,
    doctorId: doctor._id,
    patientId: appointment.patientId,
    medicines,
    advice: advice || '',
    followUpDate: followUpDate || null,
  });

  const data = await Prescription.findById(rx._id).populate(POPULATE);
  res.status(201).json({ success: true, message: 'Prescription created.', data });
});
