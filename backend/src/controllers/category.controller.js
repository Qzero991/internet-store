const { Category } = require('../db/initTables');
const handleControllerError = require('../utils/handleError')

module.exports = {

  
  
  
  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      return res.json(categories);
    } catch (err) {
      return handleControllerError(req, res, err, 'GET_ALL_CATEGORIES');
    }
  },

  
  
  
  async getOne(req, res) {
    try {
      const categoryId = Number(req.params.id);
      if (!categoryId) {
        return res.status(400).json({ error: 'Invalid category id' });
      }

      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.json(category);
    } catch (err) {
      return handleControllerError(req, res, err, 'GET_ONE_CATEGORY');
    }
  },

  
  
  
  async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      const { name, description, image_url } = req.body;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const category = await Category.create({
        name: name.trim(),
        description: description || null,
        image_url: image_url || null
      });

      return res.status(201).json(category);

    } catch (err) {
      return handleControllerError(req, res, err, 'CREATE_CATEGORY');
    }
  },

  
  
  
  async update(req, res) {
    try {
      const categoryId = Number(req.params.id);
      if (!categoryId) {
        return res.status(400).json({ error: 'Invalid category id' });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      const allowedFields = ['name', 'description', 'image_url'];
      const updateData = {};

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const [updatedRows] = await Category.update(updateData, {
        where: { category_id: categoryId }
      });

      if (!updatedRows) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.json({ message: 'Category updated successfully' });

    } catch (err) {
      return handleControllerError(req, res, err, 'UPDATE_CATEGORY');
    }
  },

  
  
  
  async delete(req, res) {
    try {
      const categoryId = Number(req.params.id);
      if (!categoryId) {
        return res.status(400).json({ error: 'Invalid category id' });
      }

      const deleted = await Category.destroy({
        where: { category_id: categoryId }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.json({ message: 'Category deleted successfully' });

    } catch (err) {
      return handleControllerError(req, res, err, 'DELETE_CATEGORY');
    }
  }

};
