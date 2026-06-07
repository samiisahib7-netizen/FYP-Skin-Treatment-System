/**
 * Patient controller.
 *   GET    /patients        admin | doctor — list all
 *   GET    /patients/:id    admin | doctor | self
 *   POST   /patients        admin — create user + patient record
 *   PUT    /patients/:id    admin | self — update patient details
 *   DELETE /patients/:id    admin
 */
const User = require('../models/User');
const Patient = require('../models/Patient');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.listPatients = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const userQ = { role: 'patient' };
  if (search) userQ.name = { $regex: search, $options: 'i' };
  const users = await User.find(userQ).sort('-createdAt');
  const patientRecords = await Patient.find({ userId: { $in: users.map((u) => u._id) } });
  const merged = users.map((u) => {
    const p = patientRecords.find((pr) => pr.userId.toString() === u._id.toString());
    return { ...u.toObject(), patient: p || null };
  });
  res.json({ success: true, data: merged });
});

exports.getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) throw new ApiError(404, 'Patient not found');
  const user = await User.findById(patient.userId);
  res.json({ success: true, data: { ...user.toObject(), patient } });
});

exports.createPatient = asyncHandler(async (req, res) => {
  const { name, email, password, phone, dateOfBirth, gender, address, medicalHistory, allergies } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'A user with this email already exists.');

  const user = await User.create({ name, email, password, role: 'patient', phone });
  const patient = await Patient.create({
    userId: user._id,
    dateOfBirth,
    gender,
    address,
    medicalHistory,
    allergies,
  });

  res.status(201).json({
    success: true,
    message: 'Patient created.',
    data: { ...user.toObject(), patient },
  });
});

exports.updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) throw new ApiError(404, 'Patient not found');

  const { name, phone, dateOfBirth, gender, address, medicalHistory, allergies } = req.body;

  if (name || phone !== undefined) {
    const user = await User.findById(patient.userId);
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();
  }
  if (dateOfBirth !== undefined) patient.dateOfBirth = dateOfBirth;
  if (gender !== undefined) patient.gender = gender;
  if (address !== undefined) patient.address = address;
  if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;
  if (allergies !== undefined) patient.allergies = allergies;
  await patient.save();

  res.json({ success: true, message: 'Patient updated.', data: patient });
});

exports.deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) throw new ApiError(404, 'Patient not found');
  await User.findByIdAndDelete(patient.userId);
  await patient.deleteOne();
  res.json({ success: true, message: 'Patient deleted.' });
});
