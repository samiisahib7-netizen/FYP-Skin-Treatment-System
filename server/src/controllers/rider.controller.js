/**
 * Rider controller.
 *   GET    /riders            admin
 *   GET    /riders/:id        admin | self
 *   POST   /riders            admin — create user + rider record
 *   PUT    /riders/:id        admin | self
 *   DELETE /riders/:id        admin
 */
const User = require('../models/User');
const Rider = require('../models/Rider');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.listRiders = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'rider' }).sort('-createdAt');
  const riderRecords = await Rider.find({ userId: { $in: users.map((u) => u._id) } });
  const merged = users.map((u) => {
    const r = riderRecords.find((rr) => rr.userId.toString() === u._id.toString());
    return { ...u.toObject(), rider: r || null };
  });
  res.json({ success: true, data: merged });
});

exports.getRider = asyncHandler(async (req, res) => {
  const rider = await Rider.findById(req.params.id);
  if (!rider) throw new ApiError(404, 'Rider not found');
  const user = await User.findById(rider.userId);
  res.json({ success: true, data: { ...user.toObject(), rider } });
});

exports.createRider = asyncHandler(async (req, res) => {
  const { name, email, password, phone, vehicleNo, area } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'A user with this email already exists.');

  const user = await User.create({ name, email, password, role: 'rider', phone });
  const rider = await Rider.create({ userId: user._id, vehicleNo, area });
  res.status(201).json({ success: true, message: 'Rider created.', data: { ...user.toObject(), rider } });
});

exports.updateRider = asyncHandler(async (req, res) => {
  const rider = await Rider.findById(req.params.id);
  if (!rider) throw new ApiError(404, 'Rider not found');
  const { name, phone, vehicleNo, area, isAvailable } = req.body;

  if (name || phone !== undefined) {
    const user = await User.findById(rider.userId);
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();
  }
  if (vehicleNo !== undefined) rider.vehicleNo = vehicleNo;
  if (area !== undefined) rider.area = area;
  if (isAvailable !== undefined) rider.isAvailable = isAvailable;
  await rider.save();

  res.json({ success: true, message: 'Rider updated.', data: rider });
});

exports.deleteRider = asyncHandler(async (req, res) => {
  const rider = await Rider.findById(req.params.id);
  if (!rider) throw new ApiError(404, 'Rider not found');
  await User.findByIdAndDelete(rider.userId);
  await rider.deleteOne();
  res.json({ success: true, message: 'Rider deleted.' });
});
