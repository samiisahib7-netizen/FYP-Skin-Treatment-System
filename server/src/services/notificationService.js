/**
 * Notification helper — create in-app alerts for users.
 */
const Notification = require('../models/Notification');

async function createNotification(userId, { type = 'general', title, message, meta = null }) {
  if (!userId || !title || !message) return null;
  return Notification.create({ userId, type, title, message, meta });
}

async function notifyUserIds(userIds, payload) {
  const ids = [...new Set(userIds.filter(Boolean).map((id) => id.toString()))];
  await Promise.all(ids.map((userId) => createNotification(userId, payload)));
}

module.exports = { createNotification, notifyUserIds };
