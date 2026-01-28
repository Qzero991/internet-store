const router = require('express').Router();
const controller = require('../controllers/paymentMethod.controller');
const auth = require('../utils/auth.middleware');

router.get('/', auth, controller.getMyPaymentMethods);
router.post('/', auth, controller.addPaymentMethod);
router.delete('/:payment_method_id', auth, controller.deletePaymentMethod);

module.exports = router;
