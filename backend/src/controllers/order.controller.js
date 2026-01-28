const { ValidationError } = require('sequelize');
const {
  Order,
  OrderProduct,
  CartItem,
  Product,
  sequelize
} = require('../db/initTables');

// Общий обработчик ошибок
const handleControllerError = (res, err, context) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map(e => e.message)
    });
  }
  console.error(`${context} ERROR:`, err);
  return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {

  // =========================
  // 🔹 СОЗДАНИЕ ЗАКАЗА
  // =========================
  async createOrder(req, res) {
    const userId = req.user.sub;

    const transaction = await sequelize.transaction();

    try {
      // 1. Получаем корзину
      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        include: Product,
        transaction
      });

      if (cartItems.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // 2. Считаем итоговую цену
      let total_price = 0;

      cartItems.forEach(item => {
        total_price += item.quantity * item.Product.price;
      });

      // 3. Создаём заказ
      const order = await Order.create({
        user_id: userId,
        status: 'pending',
        total_price
      }, { transaction });

      // 4. Создаём OrderProduct
      const orderProducts = cartItems.map(item => ({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.Product.price
      }));

      await OrderProduct.bulkCreate(orderProducts, { transaction });

      // 5. Очищаем корзину
      await CartItem.destroy({
        where: { user_id: userId },
        transaction
      });

      await transaction.commit();

      return res.status(201).json({
        message: 'Order created successfully',
        order_id: order.order_id
      });

    } catch (err) {
      await transaction.rollback();
      return handleControllerError(res, err, 'CREATE_ORDER');
    }
  },

  // =========================
  // 🔹 МОИ ЗАКАЗЫ
  // =========================
  async getMyOrders(req, res) {
    try {
      const userId = req.user.sub;

      const orders = await Order.findAll({
        where: { user_id: userId },
        order: [['order_date', 'DESC']]
      });

      return res.json(orders);

    } catch (err) {
      return handleControllerError(res, err, 'GET_MY_ORDERS');
    }
  },

  // =========================
  // 🔹 ЗАКАЗ ПО ID
  // =========================
  async getOrderById(req, res) {
    try {
      const userId = req.user.sub;
      const { order_id } = req.params;

      const order = await Order.findOne({
        where: { order_id, user_id: userId },
        include: {
          model: Product,
          through: {
            attributes: ['quantity', 'price_at_purchase']
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.json(order);

    } catch (err) {
      return handleControllerError(res, err, 'GET_ORDER_BY_ID');
    }
  },

  // =========================
  // 🔹 ОБНОВЛЕНИЕ СТАТУСА (АДМИН)
  // =========================
  async updateOrderStatus(req, res) {
    try {
      const { order_id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        'pending',
        'paid',
        'shipped',
        'delivered',
        'cancelled'
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid order status' });
      }

      const [updated] = await Order.update(
        { status },
        { where: { order_id } }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.json({ message: 'Order status updated' });

    } catch (err) {
      return handleControllerError(res, err, 'UPDATE_ORDER_STATUS');
    }
  }

};
