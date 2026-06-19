/**
 * Clean up test-created data from comprehensive / E2E test runs.
 * Run: node src/scripts/clean-test-data.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

async function clean() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skin-treatment');

  // Delete all appointments that aren't the 2 seed ones
  const seedSlots = ['10:00-10:30', '14:00-14:30'];
  const r = await Appointment.deleteMany({ timeSlot: { $nin: seedSlots } });
  console.log('Deleted test appointments:', r.deletedCount);

  await mongoose.disconnect();
}

clean().catch(console.error);
