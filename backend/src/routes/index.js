const router = require('express').Router();

router.use('/users', require('./user.routes'));
router.use('/categories', require('./category.routes'));
router.use('/products', require('./product.routes'));
router.use('/cartItems', require('./cartItems.routes'));
router.use('/orders', require('./order.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/paymentMethod', require('./paymentMethod.routes'));


module.exports = router;