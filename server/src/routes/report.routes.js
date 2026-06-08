/**
 * Report routes — /api/v1/reports
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');
const { uploadReport, handleUploadError } = require('../middlewares/upload');

const ctrl = require('../controllers/report.controller');
const { createReportSchema } = require('../validators/report.validators');

router.get('/', auth, roleGuard('patient', 'doctor', 'admin'), ctrl.listReports);
router.get('/:id', auth, roleGuard('patient', 'doctor', 'admin'), ctrl.getReport);
router.post(
  '/',
  auth,
  roleGuard('admin', 'doctor'),
  uploadReport,
  handleUploadError,
  validate(createReportSchema),
  ctrl.createReport
);
router.delete('/:id', auth, roleGuard('admin'), ctrl.deleteReport);

module.exports = router;
