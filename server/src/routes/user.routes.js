/**
 * User routes — /api/v1/users
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');

const ctrl = require('../controllers/user.controller');
const { updateUserSchema, updateProfileSchema } = require('../validators/user.validators');

router.get('/', auth, roleGuard('admin'), ctrl.listUsers);
router.put('/profile', auth, validate(updateProfileSchema), ctrl.updateOwnProfile);
router.get('/:id', auth, ctrl.getUser);
router.put('/:id', auth, roleGuard('admin'), validate(updateUserSchema), ctrl.updateUser);
router.delete('/:id', auth, roleGuard('admin'), ctrl.deleteUser);

module.exports = router;
