const router = require('express').Router();
const controller = require('../controllers/review.controller');
const auth = require('../utils/auth.middleware');

// публичные
router.get('/product/:product_id', controller.getProductReviews);

// защищённые
router.post('/', auth, controller.createReview);
router.put('/:review_id', auth, controller.updateReview);
router.delete('/:review_id', auth, controller.deleteReview);

module.exports = router;
