/**
 * Notification helper — in-app alerts + optional email copy.
 */
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendNotificationEmail } = require('./emailService');

async function createNotification(userId, { type = 'general', title, message, meta = null, email = true }) {
  if (!userId || !title || !message) return null;

  const note = await Notification.create({ userId, type, title, message, meta });

  if (email) {
    User.findById(userId)
      .select('email')
      .lean()
      .then((user) => {
        if (user?.email) {
          sendNotificationEmail({ to: user.email, subject: title, text: message }).catch((err) => {
            // eslint-disable-next-line no-console
            console.error('[notification] email failed:', err.message);
          });
        }
      })
      .catch(() => {});
  }

  return note;
}

async function notifyUserIds(userIds, payload) {
  const ids = [...new Set(userIds.filter(Boolean).map((id) => id.toString()))];
  await Promise.all(ids.map((userId) => createNotification(userId, payload)));
}

module.exports = { createNotification, notifyUserIds };
