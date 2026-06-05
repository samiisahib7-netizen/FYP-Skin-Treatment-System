/**
 * Auth routes — placeholder for Module 0.
 * Full register/login/me/forgot/reset/change-password endpoints are implemented in Module 1.
 */
const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ success: true, message: 'Auth router is mounted. Full endpoints coming in Module 1.' });
});

module.exports = router;
