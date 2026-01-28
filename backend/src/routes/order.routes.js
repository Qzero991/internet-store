const router = require('express').Router();
const controller = require('../controllers/order.controller');
const auth = require('../utils/auth.middleware');
const isAdmin = require('../utils/admin.middleware');


router.post('/', auth, controller.createOrder);     
router.get('/my', auth, controller.getMyOrders);    
router.get('/:order_id', auth, controller.getOrderById);


router.put('/:order_id/status', auth, isAdmin, controller.updateOrderStatus);

module.exports = router;
