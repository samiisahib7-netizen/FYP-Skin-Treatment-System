/**
 * Auth controller.
 * - register:        POST /auth/register
 * - login:           POST /auth/login
 * - me:              GET  /auth/me
 * - forgotPassword:  POST /auth/forgot-password
 * - resetPassword:   POST /auth/reset-password/:token
 * - changePassword:  POST /auth/change-password
 * - logout:          POST /auth/logout  (stateless — client-side clear)
 */
const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/jwt');
const { sendPasswordResetEmail } = require('../services/emailService');

/** Helpers */
const issueToken = (user) => signToken({ id: user._id, role: user.role });

/**
 * Self-registration is allowed for patients only.
 * Doctors and riders are created by Admin (FR-4 / FR-11 — see Module 3 / 10).
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (role && role !== 'patient') {
    throw new ApiError(403, `Self-registration is only allowed for patients. Role '${role}' must be created by an admin.`);
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  const user = await User.create({ name, email, password, role: 'patient' });

  const token = issueToken(user);
  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { token, user },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // need password field — schema has select:false
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password.');
  if (!user.isActive) throw new ApiError(403, 'Account is disabled. Contact admin.');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid email or password.');

  const token = issueToken(user);
  res.json({
    success: true,
    message: 'Logged in successfully.',
    data: { token, user },
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always return the same message to avoid email-enumeration leaks.
  const generic = 'If an account exists for this email, a reset link has been sent.';

  if (!user) return res.json({ success: true, message: generic });

  const rawToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail({ to: user.email, name: user.name, rawToken });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    // eslint-disable-next-line no-console
    console.error('[forgotPassword] email send failed:', err);
  }

  res.json({ success: true, message: generic });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) throw new ApiError(400, 'Reset token is invalid or has expired.');

  user.password = password; // pre-save hook will hash
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const newJwt = issueToken(user);
  res.json({
    success: true,
    message: 'Password has been reset.',
    data: { token: newJwt, user },
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const ok = await user.comparePassword(currentPassword);
  if (!ok) throw new ApiError(401, 'Current password is incorrect.');

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully.' });
});

exports.logout = asyncHandler(async (req, res) => {
  // Stateless JWT — the client just discards the token.
  // Hook left here for future token blacklisting.
  res.json({ success: true, message: 'Logged out.' });
});
