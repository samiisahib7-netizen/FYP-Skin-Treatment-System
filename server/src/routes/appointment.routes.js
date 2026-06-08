/**
 * Appointment routes — /api/v1/appointments
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/appointment.controller');
const {
  createAppointmentSchema,
  updateStatusSchema,
  updateNotesSchema,
} = require('../validators/appointment.validators');

router.get('/', auth, roleGuard('patient', 'doctor', 'admin'), ctrl.listAppointments);
router.post('/', auth, roleGuard('patient'), validate(createAppointmentSchema), ctrl.createAppointment);
router.get('/:id', auth, roleGuard('patient', 'doctor', 'admin'), ctrl.getAppointment);
router.patch(
  '/:id/status',
  auth,
  roleGuard('doctor', 'admin'),
  validate(updateStatusSchema),
  ctrl.updateStatus
);
router.put('/:id', auth, roleGuard('doctor'), validate(updateNotesSchema), ctrl.updateNotes);

module.exports = router;
