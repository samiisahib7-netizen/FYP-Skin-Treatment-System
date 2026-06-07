/**
 * Doctor controller.
 *   GET    /doctors            public  — list (filters: search, specialization)
 *   GET    /doctors/:id        public
 *   POST   /doctors            admin   — create user + doctor record
 *   PUT    /doctors/:id        admin
 *   DELETE /doctors/:id        admin
 *   GET    /doctors/:id/availability auth
 */
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.listDoctors = asyncHandler(async (req, res) => {
  const { search, specialization } = req.query;
  const userQ = { role: 'doctor', isActive: true };
  if (search) userQ.name = { $regex: search, $options: 'i' };

  const users = await User.find(userQ).select('-password');
  let doctorRecords = await Doctor.find({ userId: { $in: users.map((u) => u._id) } });
  if (specialization) {
    const r = new RegExp(specialization, 'i');
    doctorRecords = doctorRecords.filter((d) => r.test(d.specialization));
  }

  // merge user + doctor
  const merged = users.map((u) => {
    const d = doctorRecords.find((dr) => dr.userId.toString() === u._id.toString());
    return { ...u.toObject(), doctor: d || null };
  });

  res.json({ success: true, data: merged });
});

exports.getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  const user = await User.findById(doctor.userId);
  res.json({ success: true, data: { ...user.toObject(), doctor } });
});

exports.createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, specialization, qualification, experience, consultationFee, availability, bio } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'A user with this email already exists.');

  const user = await User.create({ name, email, password, role: 'doctor', phone });
  const doctor = await Doctor.create({
    userId: user._id,
    specialization,
    qualification,
    experience,
    consultationFee,
    availability,
    bio,
  });

  res.status(201).json({
    success: true,
    message: 'Doctor created.',
    data: { ...user.toObject(), doctor },
  });
});

exports.updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  const { name, phone, specialization, qualification, experience, consultationFee, availability, bio } = req.body;

  if (name || phone !== undefined) {
    const user = await User.findById(doctor.userId);
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();
  }
  if (specialization !== undefined) doctor.specialization = specialization;
  if (qualification !== undefined) doctor.qualification = qualification;
  if (experience !== undefined) doctor.experience = experience;
  if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
  if (availability !== undefined) doctor.availability = availability;
  if (bio !== undefined) doctor.bio = bio;
  await doctor.save();

  res.json({ success: true, message: 'Doctor updated.', data: doctor });
});

exports.deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  await User.findByIdAndDelete(doctor.userId);
  await doctor.deleteOne();
  res.json({ success: true, message: 'Doctor deleted.' });
});

exports.getAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  res.json({ success: true, data: doctor.availability });
});
