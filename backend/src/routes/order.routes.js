const router = require('express').Router();
const controller = require('../controllers/order.controller');
const auth = require('../utils/auth.middleware');
const isAdmin = require('../utils/admin.middleware');

// Пользователь
router.post('/', auth, controller.createOrder);     // оформить заказ
router.get('/my', auth, controller.getMyOrders);    // мои заказы
router.get('/:order_id', auth, controller.getOrderById);

// Админ (позже добавишь middleware isAdmin)
router.put('/:order_id/status', auth, isAdmin, controller.updateOrderStatus);

module.exports = router;
