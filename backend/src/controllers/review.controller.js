const { Review, Product } = require('../db/initTables');
const handleControllerError = require('../utils/handleError')


module.exports = {

  // =========================
  // 🔹 ОТЗЫВЫ О ТОВАРЕ
  // =========================
  async getProductReviews(req, res) {
    try {
      const { product_id } = req.params;

      const reviews = await Review.findAll({
        where: { product_id },
        order: [['timestamp', 'DESC']]
      });

      return res.json(reviews);

    } catch (err) {
      return handleControllerError(req, res, err, 'GET_PRODUCT_REVIEWS');
    }
  },

  // =========================
  // 🔹 СОЗДАТЬ ОТЗЫВ
  // =========================
  async createReview(req, res) {
    try {
      const userId = req.user.sub;
      const { product_id, rating, comment } = req.body;

      if (!product_id || !rating) {
        return res.status(400).json({
          error: 'product_id and rating are required'
        });
      }

      // товар существует?
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // один отзыв на товар
      const exists = await Review.findOne({
        where: { product_id, user_id: userId }
      });

      if (exists) {
        return res.status(409).json({
          error: 'You have already reviewed this product'
        });
      }

      const review = await Review.create({
        product_id,
        user_id: userId,
        rating,
        comment: comment || null
      });

      return res.status(201).json({
        message: 'Review created',
        review_id: review.review_id
      });

    } catch (err) {
      return handleControllerError(req, res, err, 'CREATE_REVIEW');
    }
  },

  // =========================
  // 🔹 ОБНОВИТЬ ОТЗЫВ
  // =========================
  async updateReview(req, res) {
    try {
      const userId = req.user.sub;
      const { review_id } = req.params;
      const { rating, comment } = req.body;

      const review = await Review.findOne({
        where: { review_id, user_id: userId }
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (rating !== undefined) review.rating = rating;
      if (comment !== undefined) review.comment = comment;

      await review.save();

      return res.json({ message: 'Review updated' });

    } catch (err) {
      return handleControllerError(req, res, err, 'UPDATE_REVIEW');
    }
  },

  // =========================
  // 🔹 УДАЛИТЬ ОТЗЫВ
  // =========================
  async  deleteReview(req, res) {
    try {
      const userId = req.user.sub;
      const { review_id } = req.params;

      const deleted = await Review.destroy({
        where: { review_id, user_id: userId }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Review not found' });
      }

      return res.json({ message: 'Review deleted' });

    } catch (err) {
      return handleControllerError(req, res, err, 'DELETE_REVIEW');
    }
  }

};
