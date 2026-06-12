/**
 * Email service — Nodemailer (Gmail SMTP) with console fallback in dev.
 * Mock mode when SMTP credentials are placeholders (same pattern as Stripe).
 */
const nodemailer = require('nodemailer');

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const IS_MOCK =
  !SMTP_USER ||
  !SMTP_PASS ||
  SMTP_USER.includes('your-email') ||
  SMTP_PASS.includes('your-app-password');

let transporter = null;

function getTransporter() {
  if (IS_MOCK) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== 'false',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

function fromAddress() {
  return process.env.SMTP_FROM || `"Skin Treatment" <${SMTP_USER}>`;
}

async function deliver({ to, subject, text, html }) {
  if (IS_MOCK) {
    // eslint-disable-next-line no-console
    console.log('\n========== [email MOCK] ==========');
    // eslint-disable-next-line no-console
    console.log(`To:      ${to}`);
    // eslint-disable-next-line no-console
    console.log(`Subject: ${subject}`);
    // eslint-disable-next-line no-console
    console.log(text || html || '');
    // eslint-disable-next-line no-console
    console.log('==================================\n');
    return { mock: true };
  }

  const transport = getTransporter();
  const info = await transport.sendMail({
    from: fromAddress(),
    to,
    subject,
    text,
    html: html || text?.replace(/\n/g, '<br>'),
  });
  return { messageId: info.messageId };
}

const RESET_TEMPLATE = (name, link) => `
Hello ${name || 'there'},

We received a request to reset your Skin Treatment password.
Click the link below to set a new password. It expires in 1 hour.

${link}

If you did not request this, you can safely ignore this email.

— Skin Treatment Team
`;

async function sendPasswordResetEmail({ to, name, rawToken }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const link = `${clientUrl}/reset-password/${rawToken}`;
  const text = RESET_TEMPLATE(name, link);

  await deliver({
    to,
    subject: 'Reset your Skin Treatment password',
    text,
  });

  return { link, mock: IS_MOCK };
}

async function sendNotificationEmail({ to, subject, text }) {
  await deliver({ to, subject, text });
}

async function sendWelcomeEmail({ to, name }) {
  const text = `Hello ${name || 'there'},\n\nWelcome to Skin Treatment! Book appointments, view prescriptions, and shop skincare products from your dashboard.\n\n— Skin Treatment Team`;
  await deliver({ to, subject: 'Welcome to Skin Treatment', text });
}

function isMockMode() {
  return IS_MOCK;
}

module.exports = {
  sendPasswordResetEmail,
  sendNotificationEmail,
  sendWelcomeEmail,
  isMockMode,
};
