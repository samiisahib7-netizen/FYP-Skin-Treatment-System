/**
 * Auth router — /api/v1/auth
 *   POST /register
 *   POST /login                  (rate-limited)
 *   POST /forgot-password        (rate-limited)
 *   POST /reset-password/:token
 *   GET  /me                     (auth)
 *   POST /change-password        (auth)
 *   POST /logout                 (auth)
 */
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const authLimiter = require('../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validators/auth.validators');

router.post('/register', authLimiter, validate(registerSchema), ctrl.register);
router.post('/login', authLimiter, validate(loginSchema), ctrl.login);

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema, 'body'), ctrl.resetPassword);

router.get('/me', auth, ctrl.me);
router.post('/change-password', auth, validate(changePasswordSchema), ctrl.changePassword);
router.post('/logout', auth, ctrl.logout);

module.exports = router;
