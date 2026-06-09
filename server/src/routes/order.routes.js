/**
 * Order routes — /api/v1/orders
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/order.controller');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/order.validators');

router.get('/', auth, roleGuard('patient', 'admin'), ctrl.listOrders);
router.post('/', auth, roleGuard('patient'), validate(createOrderSchema), ctrl.createOrder);
router.get('/:id', auth, roleGuard('patient', 'admin'), ctrl.getOrder);
router.patch(
  '/:id/status',
  auth,
  roleGuard('admin'),
  validate(updateOrderStatusSchema),
  ctrl.updateStatus
);

module.exports = router;
