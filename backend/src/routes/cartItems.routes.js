const router = require('express').Router();
const controller = require('../controllers/cartItem.controller');
const auth = require('../utils/auth.middleware');


router.get('/', auth, controller.getCart);
router.post('/', auth, controller.addToCart);
router.put('/:cart_item_id', auth, controller.updateQuantity);
router.delete('/:cart_item_id', auth, controller.removeItem);
router.delete('/', auth, controller.clearCart);

module.exports = router;
