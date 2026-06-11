/**
 * Notification controller.
 *   GET   /notifications              authenticated user
 *   GET   /notifications/unread-count authenticated user
 *   PATCH /notifications/:id/read     authenticated user
 *   PATCH /notifications/read-all     authenticated user
 */
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.listNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly } = req.query;
  const q = { userId: req.user._id };
  if (unreadOnly === 'true') q.isRead = false;

  const items = await Notification.find(q).sort('-createdAt').limit(100);
  res.json({ success: true, data: items });
});

exports.unreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
  res.json({ success: true, data: { count } });
});

exports.markRead = asyncHandler(async (req, res) => {
  const note = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
  if (!note) throw new ApiError(404, 'Notification not found');

  note.isRead = true;
  await note.save();
  res.json({ success: true, message: 'Marked as read.', data: note });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read.' });
});
