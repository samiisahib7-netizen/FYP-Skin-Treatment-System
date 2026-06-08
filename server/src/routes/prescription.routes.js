/**
 * Prescription routes — /api/v1/prescriptions
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/prescription.controller');
const { createPrescriptionSchema } = require('../validators/prescription.validators');

router.get('/', auth, roleGuard('patient', 'doctor', 'admin'), ctrl.listPrescriptions);
router.get(
  '/appointment/:appointmentId',
  auth,
  roleGuard('patient', 'doctor', 'admin'),
  ctrl.getByAppointment
);
router.get('/:id', auth, roleGuard('patient', 'doctor', 'admin'), ctrl.getPrescription);
router.post(
  '/',
  auth,
  roleGuard('doctor'),
  validate(createPrescriptionSchema),
  ctrl.createPrescription
);

module.exports = router;
