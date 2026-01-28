const { CartItem, Product } = require('../db/initTables');
const handleControllerError = require('../utils/handleError')

module.exports = {

  // =========================
  // 🔹 ПОЛУЧИТЬ КОРЗИНУ
  // =========================
  async getCart(req, res) {
    try {
      const userId = req.user.sub;

      const items = await CartItem.findAll({
        where: { user_id: userId },
        include: {
          model: Product,
          attributes: ['product_id', 'name', 'price']
        },
        order: [['added_at', 'DESC']]
      });

      return res.json(items);

    } catch (err) {
      return handleControllerError(req, res, err, 'GET_CART');
    }
  },

  // =========================
  // 🔹 ДОБАВИТЬ В КОРЗИНУ
  // =========================
  async addToCart(req, res) {
    try {
      const userId = req.user.sub;

      if (!req.body || !req.body.product_id) {
        return res.status(400).json({ error: 'product_id is required' });
      }

      const { product_id, quantity = 1 } = req.body;

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be a positive integer' });
      }

      // Проверяем, существует ли товар
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Проверяем, есть ли уже такой товар в корзине
      const existingItem = await CartItem.findOne({
        where: { user_id: userId, product_id }
      });

      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();

        return res.json({
          message: 'Cart item quantity updated',
          cart_item_id: existingItem.cart_item_id
        });
      }

      const cartItem = await CartItem.create({
        user_id: userId,
        product_id,
        quantity
      });

      return res.status(201).json({
        message: 'Item added to cart',
        cart_item_id: cartItem.cart_item_id
      });

    } catch (err) {
      return handleControllerError(req, res, err, 'ADD_TO_CART');
    }
  },

  // =========================
  // 🔹 ИЗМЕНИТЬ КОЛИЧЕСТВО
  // =========================
  async updateQuantity(req, res) {
    try {
      const userId = req.user.sub;
      const { cart_item_id } = req.params;
      const { quantity } = req.body;

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be a positive integer' });
      }

      const item = await CartItem.findOne({
        where: {
          cart_item_id,
          user_id: userId
        }
      });

      if (!item) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      item.quantity = quantity;
      await item.save();

      return res.json({ message: 'Quantity updated' });

    } catch (err) {
      return handleControllerError(req, res, err, 'UPDATE_CART_ITEM');
    }
  },

  // =========================
  // 🔹 УДАЛИТЬ ОДИН ТОВАР
  // =========================
  async removeItem(req, res) {
    try {
      const userId = req.user.sub;
      const { cart_item_id } = req.params;

      const deleted = await CartItem.destroy({
        where: {
          cart_item_id,
          user_id: userId
        }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      return res.json({ message: 'Item removed from cart' });

    } catch (err) {
      return handleControllerError(res, err, 'REMOVE_CART_ITEM');
    }
  },

  // =========================
  // 🔹 ОЧИСТИТЬ КОРЗИНУ
  // =========================
  async clearCart(req, res) {
    try {
      const userId = req.user.sub;

      await CartItem.destroy({
        where: { user_id: userId }
      });

      return res.json({ message: 'Cart cleared' });

    } catch (err) {
      return handleControllerError(req, res, err, 'CLEAR_CART');
    }
  }

};
