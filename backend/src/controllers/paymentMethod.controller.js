const { PaymentMethod } = require('../db/initTables');
const handleControllerError = require('../utils/handleError')
module.exports = {

  // =========================
  // 🔹 МОИ СПОСОБЫ ОПЛАТЫ
  // =========================
  async getMyPaymentMethods(req, res) {
    try {
      const userId = req.user.sub;

      const methods = await PaymentMethod.findAll({
        where: { user_id: userId },
        attributes: {
          exclude: ['cvv']
        }
      });

      return res.json(methods);

    } catch (err) {
      return handleControllerError(req, res, err, 'GET_PAYMENT_METHODS');
    }
  },

  // =========================
  // 🔹 ДОБАВИТЬ КАРТУ
  // =========================
  async addPaymentMethod(req, res) {
    try {
      const userId = req.user.sub;
      const { card_number, expiration_date, cvv } = req.body;

      if (!card_number || !expiration_date || !cvv) {
        return res.status(400).json({
          error: 'card_number, expiration_date and cvv are required'
        });
      }

      const method = await PaymentMethod.create({
        user_id: userId,
        card_number,
        expiration_date,
        cvv
      });

      return res.status(201).json({
        message: 'Payment method added',
        payment_method_id: method.payment_method_id
      });

    } catch (err) {
      return handleControllerError(req, res, err, 'ADD_PAYMENT_METHOD');
    }
  },

  // =========================
  // 🔹 УДАЛИТЬ КАРТУ
  // =========================
  async deletePaymentMethod(req, res) {
    try {
      const userId = req.user.sub;
      const { payment_method_id } = req.params;

      const deleted = await PaymentMethod.destroy({
        where: {
          payment_method_id,
          user_id: userId
        }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Payment method not found' });
      }

      return res.json({ message: 'Payment method removed' });

    } catch (err) {
      return handleControllerError(req, res, err, 'DELETE_PAYMENT_METHOD');
    }
  }

};
