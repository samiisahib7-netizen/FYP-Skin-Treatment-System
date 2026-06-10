/**
 * Resolve role-specific profile documents from the authenticated User.
 */
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Rider = require('../models/Rider');
const ApiError = require('./ApiError');

exports.getPatientByUser = async (userId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) throw new ApiError(404, 'Patient profile not found');
  return patient;
};

exports.getDoctorByUser = async (userId) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) throw new ApiError(404, 'Doctor profile not found');
  return doctor;
};

exports.getRiderByUser = async (userId) => {
  const rider = await Rider.findOne({ userId });
  if (!rider) throw new ApiError(404, 'Rider profile not found');
  return rider;
};
