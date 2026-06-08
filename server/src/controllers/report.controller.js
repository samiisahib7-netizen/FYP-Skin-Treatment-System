/**
 * Report controller.
 *   GET    /reports       patient (own) | doctor | admin (all)
 *   GET    /reports/:id   authorized
 *   POST   /reports       admin | doctor (multipart)
 *   DELETE /reports/:id   admin
 */
const fs = require('fs');
const path = require('path');
const Report = require('../models/Report');
const Patient = require('../models/Patient');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPatientByUser } = require('../utils/roleProfile');

const POPULATE = [
  { path: 'patientId', populate: { path: 'userId', select: '-password' } },
  { path: 'uploadedBy', select: '-password' },
  { path: 'appointmentId' },
];

function fileTypeFromMime(mimetype) {
  if (mimetype === 'application/pdf') return 'pdf';
  return 'image';
}

async function assertCanViewReport(req, report) {
  const role = req.user.role;
  if (role === 'admin' || role === 'doctor') return;

  if (role === 'patient') {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient || report.patientId.toString() !== patient._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }
    return;
  }

  throw new ApiError(403, 'Forbidden');
}

exports.listReports = asyncHandler(async (req, res) => {
  const q = {};
  if (req.user.role === 'patient') {
    const patient = await getPatientByUser(req.user._id);
    q.patientId = patient._id;
  }

  const items = await Report.find(q).sort('-createdAt').populate(POPULATE);
  res.json({ success: true, data: items });
});

exports.getReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate(POPULATE);
  if (!report) throw new ApiError(404, 'Report not found');
  await assertCanViewReport(req, report);
  res.json({ success: true, data: report });
});

exports.createReport = asyncHandler(async (req, res) => {
  if (!['admin', 'doctor'].includes(req.user.role)) {
    throw new ApiError(403, 'Only admins or doctors can upload reports');
  }
  if (!req.file) throw new ApiError(400, 'Report file is required');

  const { patientId, title, description, appointmentId } = req.body;
  const patient = await Patient.findById(patientId);
  if (!patient) throw new ApiError(404, 'Patient not found');

  const fileUrl = `/uploads/reports/${req.file.filename}`;
  const report = await Report.create({
    patientId,
    uploadedBy: req.user._id,
    title,
    description: description || '',
    fileUrl,
    fileType: fileTypeFromMime(req.file.mimetype),
    appointmentId: appointmentId && appointmentId !== '' ? appointmentId : null,
  });

  const data = await Report.findById(report._id).populate(POPULATE);
  res.status(201).json({ success: true, message: 'Report uploaded.', data });
});

exports.deleteReport = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') throw new ApiError(403, 'Only admins can delete reports');

  const report = await Report.findById(req.params.id);
  if (!report) throw new ApiError(404, 'Report not found');

  if (report.fileUrl) {
    const filename = path.basename(report.fileUrl);
    const filepath = path.join(__dirname, '..', '..', 'uploads', 'reports', filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }

  await report.deleteOne();
  res.json({ success: true, message: 'Report deleted.' });
});
