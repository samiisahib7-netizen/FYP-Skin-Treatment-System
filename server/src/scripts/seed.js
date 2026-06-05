/**
 * Seed script — creates a default admin (and optionally a doctor, patient, rider).
 * Usage:   npm run seed
 * Env vars (with defaults):
 *   SEED_ADMIN_EMAIL    = admin@skintreatment.local
 *   SEED_ADMIN_PASSWORD = Admin@12345
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function seed() {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@skintreatment.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

  const exists = await User.findOne({ email });
  if (exists) {
    // eslint-disable-next-line no-console
    console.log(`[seed] admin already exists: ${email}`);
  } else {
    await User.create({ name: 'Site Admin', email, password, role: 'admin' });
    // eslint-disable-next-line no-console
    console.log(`[seed] admin created: ${email} / ${password}`);
  }

  // eslint-disable-next-line no-console
  console.log('[seed] done');
  process.exit(0);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', err);
  process.exit(1);
});
