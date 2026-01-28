const { ValidationError } = require('sequelize');
const { Product, Category } = require('../db/initTables');
const handleControllerError = require('../utils/handleError')

module.exports = {

  // =========================
  // 🔹 ПОЛУЧИТЬ ВСЕ ТОВАРЫ
  // =========================
  async getAll(req, res) {
    try {
      const products = await Product.findAll({
        include: [{ model: Category }]
      });
      return res.json(products);
    } catch (err) {
      return handleControllerError(req, res, err, 'GET_PRODUCTS');
    }
  },

  // =========================
  // 🔹 ПОЛУЧИТЬ ОДИН ТОВАР
  // =========================
  async getOne(req, res) {
    try {
      const productId = Number(req.params.id);
      if (!productId) {
        return res.status(400).json({ error: 'Invalid product id' });
      }

      const product = await Product.findByPk(productId, {
        include: [{ model: Category }]
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json(product);
    } catch (err) {
      return handleControllerError(req, res, err, 'GET_PRODUCT');
    }
  },

  // =========================
  // 🔹 СОЗДАНИЕ ТОВАРА
  // =========================
  async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      const {
        name,
        description,
        price,
        stock_quantity,
        category_id,
        image_url
      } = req.body;

      // Обязательные поля
      if (!name || !price || !category_id) {
        return res.status(400).json({
          error: 'Missing required fields: name, price, category_id'
        });
      }

      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
      }

      const product = await Product.create({
        name: name.trim(),
        description: description || null,
        price,
        stock_quantity: stock_quantity ?? 0,
        category_id,
        image_url: image_url || null
      });

      return res.status(201).json(product);

    } catch (err) {
      return handleControllerError(req, res, err, 'CREATE_PRODUCT');
    }
  },

  // =========================
  // 🔹 ОБНОВЛЕНИЕ ТОВАРА
  // =========================
  async update(req, res) {
    try {
      const productId = Number(req.params.id);
      if (!productId) {
        return res.status(400).json({ error: 'Invalid product id' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      const allowedFields = [
        'name',
        'description',
        'price',
        'stock_quantity',
        'category_id',
        'image_url'
      ];

      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const [updatedRows] = await Product.update(updateData, {
        where: { product_id: productId }
      });

      if (!updatedRows) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json({ message: 'Product updated successfully' });

    } catch (err) {
      return handleControllerError(req, res, err, 'UPDATE_PRODUCT');
    }
  },

  // =========================
  // 🔹 УДАЛЕНИЕ ТОВАРА
  // =========================
  async delete(req, res) {
    try {
      const productId = Number(req.params.id);
      if (!productId) {
        return res.status(400).json({ error: 'Invalid product id' });
      }

      const deleted = await Product.destroy({
        where: { product_id: productId }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.json({ message: 'Product deleted successfully' });

    } catch (err) {
      return handleControllerError(req, res, err, 'DELETE_PRODUCT');
    }
  }

};
