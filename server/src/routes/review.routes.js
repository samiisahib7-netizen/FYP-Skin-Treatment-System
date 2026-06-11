const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');
const ctrl = require('../controllers/review.controller');
const { createReviewSchema, listReviewsQuerySchema } = require('../validators/review.validators');

router.get('/', validate(listReviewsQuerySchema, 'query'), ctrl.listReviews);
router.get('/mine', auth, roleGuard('patient'), ctrl.myReviews);
router.post('/', auth, roleGuard('patient'), validate(createReviewSchema), ctrl.createReview);
router.delete('/:id', auth, roleGuard('patient', 'admin'), ctrl.deleteReview);

module.exports = router;
