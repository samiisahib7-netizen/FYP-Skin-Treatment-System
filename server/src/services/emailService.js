/**
 * Email service — STUB.
 * For Module 1 we just log the message to the console so the password-reset flow
 * can be tested end-to-end without SMTP credentials. Module 11 will replace
 * the implementation with Nodemailer (Gmail SMTP).
 */

const RESET_TEMPLATE = (name, link) => `
Hello ${name || 'there'},

We received a request to reset your Skin Treatment password.
Click the link below to set a new password. It expires in 1 hour.

${link}

If you did not request this, you can safely ignore this email.

— Skin Treatment Team
`;

/**
 * Send a password-reset email.
 * For now: console only. Returns the raw link so tests can capture it.
 */
async function sendPasswordResetEmail({ to, name, rawToken }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const link = `${clientUrl}/reset-password/${rawToken}`;

  // eslint-disable-next-line no-console
  console.log('\n========== [email STUB] password reset ==========');
  // eslint-disable-next-line no-console
  console.log(`To:      ${to}`);
  // eslint-disable-next-line no-console
  console.log(`Subject: Reset your Skin Treatment password`);
  // eslint-disable-next-line no-console
  console.log(RESET_TEMPLATE(name, link));
  // eslint-disable-next-line no-console
  console.log('================================================\n');

  return { link };
}

/**
 * Generic notifier — placeholder so other modules can call us without a
 * circular dependency once Module 11 lands.
 */
async function sendNotificationEmail({ to, subject, text }) {
  // eslint-disable-next-line no-console
  console.log(`[email STUB] To: ${to} | Subject: ${subject}\n${text}\n`);
}

module.exports = { sendPasswordResetEmail, sendNotificationEmail };
