/**
 * Patient routes — /api/v1/patients
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/patient.controller');
const { createPatientSchema, updatePatientSchema } = require('../validators/patient.validators');

router.get('/', auth, roleGuard('admin', 'doctor'), ctrl.listPatients);
router.get('/:id', auth, ctrl.getPatient);
router.post('/', auth, roleGuard('admin'), validate(createPatientSchema), ctrl.createPatient);
router.put('/:id', auth, validate(updatePatientSchema), ctrl.updatePatient);
router.delete('/:id', auth, roleGuard('admin'), ctrl.deletePatient);

module.exports = router;
