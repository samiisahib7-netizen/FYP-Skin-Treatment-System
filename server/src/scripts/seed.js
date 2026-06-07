/**
 * Seed script — creates demo data for FYP defense + dev.
 * Idempotent: skips records that already exist (by email).
 *
 * Usage: npm run seed
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Rider = require('../models/Rider');

const DEFAULTS = [
  {
    role: 'admin',
    user: { name: 'Site Admin', email: 'admin@skintreatment.local', password: 'Admin@12345' },
  },
  {
    role: 'doctor',
    user: {
      name: 'Dr. Ayesha Khan',
      email: 'doctor@skintreatment.local',
      password: 'Doctor@12345',
    },
    extra: {
      specialization: 'Dermatologist',
      qualification: 'MBBS, FCPS Dermatology',
      experience: 8,
      consultationFee: 2000,
      bio: 'Board-certified dermatologist specializing in acne, eczema, and cosmetic skin care.',
      availability: [
        {
          day: 'Mon',
          slots: [
            { start: '10:00', end: '10:30', isBooked: false },
            { start: '10:30', end: '11:00', isBooked: false },
            { start: '11:00', end: '11:30', isBooked: false },
            { start: '14:00', end: '14:30', isBooked: false },
          ],
        },
        {
          day: 'Wed',
          slots: [
            { start: '09:00', end: '09:30', isBooked: false },
            { start: '09:30', end: '10:00', isBooked: false },
            { start: '15:00', end: '15:30', isBooked: false },
          ],
        },
        {
          day: 'Fri',
          slots: [
            { start: '11:00', end: '11:30', isBooked: false },
            { start: '11:30', end: '12:00', isBooked: false },
          ],
        },
      ],
    },
  },
  {
    role: 'patient',
    user: {
      name: 'Test Patient',
      email: 'patient@skintreatment.local',
      password: 'Patient@12345',
    },
    extra: {
      gender: 'female',
      address: 'House 12, Model Town, Lahore',
      medicalHistory: 'Mild acne, sensitive skin.',
      allergies: ['nuts'],
    },
  },
  {
    role: 'rider',
    user: {
      name: 'Rider Ali',
      email: 'rider@skintreatment.local',
      password: 'Rider@12345',
    },
    extra: {
      vehicleNo: 'LES-1234',
      area: 'Lahore Central',
      isAvailable: true,
    },
  },
];

async function upsertUser(payload) {
  const { name, email, password, role } = payload;
  let user = await User.findOne({ email });
  if (user) {
    console.log(`  · ${role} exists: ${email}`);
    return user;
  }
  user = await User.create({ name, email, password, role });
  console.log(`  ✓ ${role} created: ${email} / ${password}`);
  return user;
}

async function seed() {
  await connectDB();
  console.log('[seed] starting…');

  for (const item of DEFAULTS) {
    const user = await upsertUser(item.user);

    if (item.role === 'doctor') {
      const exists = await Doctor.findOne({ userId: user._id });
      if (!exists) {
        await Doctor.create({ userId: user._id, ...item.extra });
        console.log(`    + doctor profile created`);
      }
    }
    if (item.role === 'patient') {
      const exists = await Patient.findOne({ userId: user._id });
      if (!exists) {
        await Patient.create({ userId: user._id, ...item.extra });
        console.log(`    + patient profile created`);
      }
    }
    if (item.role === 'rider') {
      const exists = await Rider.findOne({ userId: user._id });
      if (!exists) {
        await Rider.create({ userId: user._id, ...item.extra });
        console.log(`    + rider profile created`);
      }
    }
  }

  console.log('[seed] done');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
