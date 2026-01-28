const {
  Order,
  OrderProduct,
  CartItem,
  Product,
  sequelize
} = require('../db/initTables');
const handleControllerError = require('../utils/handleError')

module.exports = {

  
  
  
  async createOrder(req, res) {
    const userId = req.user.sub;

    const transaction = await sequelize.transaction();

    try {
      
      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        include: Product,
        transaction
      });

      if (cartItems.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Cart is empty' });
      }

      
      let total_price = 0;

      cartItems.forEach(item => {
        total_price += item.quantity * item.Product.price;
      });

      
      const order = await Order.create({
        user_id: userId,
        status: 'pending',
        total_price
      }, { transaction });

      
      const orderProducts = cartItems.map(item => ({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.Product.price
      }));

      await OrderProduct.bulkCreate(orderProducts, { transaction });

      
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
      return handleControllerError(req, res, err, 'CREATE_ORDER');
    }
  },

  
  
  
  async getMyOrders(req, res) {
    try {
      const userId = req.user.sub;

      const orders = await Order.findAll({
        where: { user_id: userId },
        order: [['order_date', 'DESC']]
      });

      return res.json(orders);

    } catch (err) {
      return handleControllerError(req, res, err, 'GET_MY_ORDERS');
    }
  },

  
  
  
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
      return handleControllerError(req, res, err, 'GET_ORDER_BY_ID');
    }
  },

  
  
  
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
      return handleControllerError(req, res, err, 'UPDATE_ORDER_STATUS');
    }
  }

};
