/**
 * Doctor routes — /api/v1/doctors
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/doctor.controller');
const { createDoctorSchema, updateDoctorSchema } = require('../validators/doctor.validators');

router.get('/', ctrl.listDoctors);
router.get('/:id', ctrl.getDoctor);
router.get('/:id/availability', auth, ctrl.getAvailability);
router.post('/', auth, roleGuard('admin'), validate(createDoctorSchema), ctrl.createDoctor);
router.put('/:id', auth, roleGuard('admin'), validate(updateDoctorSchema), ctrl.updateDoctor);
router.delete('/:id', auth, roleGuard('admin'), ctrl.deleteDoctor);

module.exports = router;
