/**
 * Rider routes — /api/v1/riders
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/rider.controller');
const { createRiderSchema, updateRiderSchema } = require('../validators/rider.validators');

router.get('/', auth, roleGuard('admin'), ctrl.listRiders);
router.get('/:id', auth, ctrl.getRider);
router.post('/', auth, roleGuard('admin'), validate(createRiderSchema), ctrl.createRider);
router.put('/:id', auth, validate(updateRiderSchema), ctrl.updateRider);
router.delete('/:id', auth, roleGuard('admin'), ctrl.deleteRider);

module.exports = router;
