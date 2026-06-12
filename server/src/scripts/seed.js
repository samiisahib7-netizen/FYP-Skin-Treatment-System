/**
 * Seed script — creates demo data for FYP defense + dev.
 * Idempotent: skips records that already exist (by email / unique keys).
 *
 * Usage: npm run seed
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Rider = require('../models/Rider');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Review = require('../models/Review');
const { sendWelcomeEmail } = require('../services/emailService');

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

const SAMPLE_PRODUCTS = [
  { name: 'Gentle Foaming Cleanser', description: 'pH-balanced cleanser for sensitive skin.', category: 'cleanser', price: 1200, stock: 50, brand: 'DermaCare' },
  { name: 'Hyaluronic Acid Serum', description: 'Deep hydration for dry and dehydrated skin.', category: 'serum', price: 2400, stock: 35, brand: 'DermaCare' },
  { name: 'SPF 50 Sunscreen', description: 'Broad-spectrum UV protection, non-greasy.', category: 'sunscreen', price: 1800, stock: 60, brand: 'SunShield' },
  { name: 'Niacinamide 10% Serum', description: 'Reduces pores and evens skin tone.', category: 'serum', price: 2100, stock: 40, brand: 'ClearSkin' },
  { name: 'Moisturizing Night Cream', description: 'Rich repair cream for overnight recovery.', category: 'moisturizer', price: 1600, stock: 45, brand: 'DermaCare' },
  { name: 'Salicylic Acid Spot Treatment', description: 'Targets acne blemishes overnight.', category: 'treatment', price: 950, stock: 55, brand: 'ClearSkin' },
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

function nextWeekday(daysAhead = 1) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + daysAhead);
  return d;
}

async function seed() {
  await connectDB();
  console.log('[seed] starting…');

  for (const item of DEFAULTS) {
    const user = await upsertUser({ ...item.user, role: item.role });

    if (item.role === 'doctor') {
      const exists = await Doctor.findOne({ userId: user._id });
      if (!exists) {
        await Doctor.create({ userId: user._id, ...item.extra });
        console.log('    + doctor profile created');
      }
    }
    if (item.role === 'patient') {
      const exists = await Patient.findOne({ userId: user._id });
      if (!exists) {
        await Patient.create({ userId: user._id, ...item.extra });
        console.log('    + patient profile created');
      }
    }
    if (item.role === 'rider') {
      const exists = await Rider.findOne({ userId: user._id });
      if (!exists) {
        await Rider.create({ userId: user._id, ...item.extra });
        console.log('    + rider profile created');
      }
    }
  }

  for (const p of SAMPLE_PRODUCTS) {
    const exists = await Product.findOne({ name: p.name });
    if (!exists) {
      await Product.create(p);
      console.log(`    + product: ${p.name}`);
    }
  }

  const doctorUser = await User.findOne({ email: 'doctor@skintreatment.local' });
  const patientUser = await User.findOne({ email: 'patient@skintreatment.local' });
  const riderUser = await User.findOne({ email: 'rider@skintreatment.local' });

  if (doctorUser && patientUser) {
    const doctor = await Doctor.findOne({ userId: doctorUser._id });
    const patient = await Patient.findOne({ userId: patientUser._id });
    const rider = riderUser ? await Rider.findOne({ userId: riderUser._id }) : null;

    if (doctor && patient) {
      // Completed appointment + prescription
      const completedDate = nextWeekday(7);
      let completedAppt = await Appointment.findOne({
        patientId: patient._id,
        doctorId: doctor._id,
        timeSlot: '10:00-10:30',
        status: 'completed',
      });

      if (!completedAppt) {
        completedAppt = await Appointment.create({
          patientId: patient._id,
          doctorId: doctor._id,
          date: completedDate,
          timeSlot: '10:00-10:30',
          status: 'completed',
          reason: 'Acne follow-up (seed demo)',
        });
        console.log('    + sample completed appointment');
      }

      const rxExists = await Prescription.findOne({ appointmentId: completedAppt._id });
      if (!rxExists) {
        await Prescription.create({
          appointmentId: completedAppt._id,
          doctorId: doctor._id,
          patientId: patient._id,
          medicines: [
            { name: 'Benzoyl Peroxide 5%', dosage: 'Apply thin layer', duration: '4 weeks', instructions: 'Once daily at night' },
            { name: 'Sunscreen SPF 50', dosage: '2 finger lengths', duration: 'Ongoing', instructions: 'Every morning' },
          ],
          advice: 'Avoid direct sun exposure. Use gentle cleanser.',
        });
        console.log('    + sample prescription');
      }

      // Upcoming confirmed appointment
      const upcomingDate = nextWeekday(2);
      const upcomingExists = await Appointment.findOne({
        patientId: patient._id,
        status: 'confirmed',
        timeSlot: '14:00-14:30',
      });
      if (!upcomingExists) {
        await Appointment.create({
          patientId: patient._id,
          doctorId: doctor._id,
          date: upcomingDate,
          timeSlot: '14:00-14:30',
          status: 'confirmed',
          reason: 'Routine skin check-up',
        });
        console.log('    + upcoming confirmed appointment');
      }

      // Delivered order + payment for analytics / product reviews
      const cleanser = await Product.findOne({ name: 'Gentle Foaming Cleanser' });
      if (cleanser) {
        let deliveredOrder = await Order.findOne({
          patientId: patient._id,
          status: 'delivered',
          'items.productId': cleanser._id,
        });

        if (!deliveredOrder) {
          const payment = await Payment.create({
            userId: patientUser._id,
            type: 'order',
            refId: new Order()._id,
            amount: cleanser.price,
            stripePaymentIntentId: `pi_seed_${Date.now()}`,
            status: 'succeeded',
          });

          deliveredOrder = await Order.create({
            patientId: patient._id,
            items: [
              {
                productId: cleanser._id,
                name: cleanser.name,
                price: cleanser.price,
                quantity: 1,
              },
            ],
            totalAmount: cleanser.price,
            shippingAddress: patient.address || 'House 12, Model Town, Lahore',
            status: 'delivered',
            riderId: rider?._id || null,
            paymentId: payment._id,
          });

          payment.refId = deliveredOrder._id;
          await payment.save();
          console.log('    + sample delivered order + payment');
        }
      }

      // Notifications
      const welcomeExists = await Notification.findOne({
        userId: patientUser._id,
        title: 'Welcome to Skin Treatment',
      });
      if (!welcomeExists) {
        await Notification.create({
          userId: patientUser._id,
          type: 'general',
          title: 'Welcome to Skin Treatment',
          message: 'Book appointments, view prescriptions, and shop skincare products from your dashboard.',
        });
        await sendWelcomeEmail({ to: patientUser.email, name: patientUser.name });
        console.log('    + welcome notification + email');
      }

      const doctorNoteExists = await Notification.findOne({
        userId: doctorUser._id,
        title: 'New appointment request',
      });
      if (!doctorNoteExists) {
        await Notification.create({
          userId: doctorUser._id,
          type: 'appointment',
          title: 'Upcoming patient visit',
          message: 'Test Patient has a confirmed appointment in the next few days.',
        });
        console.log('    + doctor notification');
      }

      // Doctor review
      const reviewExists = await Review.findOne({
        patientId: patient._id,
        targetType: 'doctor',
        targetId: doctor._id,
      });
      if (!reviewExists) {
        await Review.create({
          patientId: patient._id,
          targetType: 'doctor',
          targetId: doctor._id,
          rating: 5,
          comment: 'Very professional and helpful consultation.',
          appointmentId: completedAppt._id,
        });
        await Doctor.findByIdAndUpdate(doctor._id, { rating: 5, totalReviews: 1 });
        console.log('    + sample doctor review');
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
