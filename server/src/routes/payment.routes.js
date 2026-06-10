/**
 * Payment routes — /api/v1/payments
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/payment.controller');
const { createIntentSchema, confirmPaymentSchema } = require('../validators/payment.validators');

router.post('/intent', auth, roleGuard('patient'), validate(createIntentSchema), ctrl.createIntent);
router.post('/confirm', auth, roleGuard('patient'), validate(confirmPaymentSchema), ctrl.confirmPayment);

module.exports = router;
