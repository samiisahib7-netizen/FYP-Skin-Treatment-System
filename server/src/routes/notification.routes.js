const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const ctrl = require('../controllers/notification.controller');
const { listQuerySchema } = require('../validators/notification.validators');

router.get('/unread-count', auth, ctrl.unreadCount);
router.patch('/read-all', auth, ctrl.markAllRead);
router.get('/', auth, validate(listQuerySchema, 'query'), ctrl.listNotifications);
router.patch('/:id/read', auth, ctrl.markRead);

module.exports = router;
