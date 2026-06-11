const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const ctrl = require('../controllers/analytics.controller');

router.use(auth, roleGuard('admin'));

router.get('/overview', ctrl.overview);
router.get('/appointments-by-status', ctrl.appointmentsByStatus);
router.get('/orders-by-status', ctrl.ordersByStatus);
router.get('/revenue-by-month', ctrl.revenueByMonth);

module.exports = router;
