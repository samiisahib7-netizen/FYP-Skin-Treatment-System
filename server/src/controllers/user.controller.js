/**
 * User controller.
 *   GET    /users          admin
 *   GET    /users/:id      admin | self
 *   PUT    /users/:id      admin
 *   DELETE /users/:id      admin
 *   PUT    /users/profile  auth — update own profile
 *   GET    /users/doctors  admin — list all doctors
 *   GET    /users/patients admin — list all patients
 *   GET    /users/riders   admin — list all riders
 */
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Rider = require('../models/Rider');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.listUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 50 } = req.query;
  const q = {};
  if (role) q.role = role;
  if (search) q.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(q).sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(q),
  ]);
  res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, phone, role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) user.name = name;
  if (email && email !== user.email) {
    const exists = await User.findOne({ email, _id: { $ne: user._id } });
    if (exists) throw new ApiError(409, 'Email already in use');
    user.email = email;
  }
  if (phone !== undefined) user.phone = phone;
  if (role && role !== user.role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();
  res.json({ success: true, message: 'User updated.', data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account.');
  }
  // Cascade: remove role-specific record
  if (user.role === 'doctor') await Doctor.findOneAndDelete({ userId: user._id });
  if (user.role === 'patient') await Patient.findOneAndDelete({ userId: user._id });
  if (user.role === 'rider') await Rider.findOneAndDelete({ userId: user._id });
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted.' });
});

exports.updateOwnProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();
  res.json({ success: true, message: 'Profile updated.', data: user });
});
