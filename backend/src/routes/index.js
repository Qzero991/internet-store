const router = require('express').Router();

router.use('/users', require('./user.routes'));
router.use('/categories', require('./category.routes'));
router.use('/products', require('./product.routes'));

module.exports = router;