const { Category } = require('../db/initTables');

const handleError = (res, err, context) => {
    console.error(`${context} ERROR:`, err);
    return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {
    async getAll(req, res) {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (err) { handleError(res, err, 'GET_ALL_CATEGORIES'); }
    },

    async getOne(req, res) {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.json(category);
        } catch (err) { handleError(res, err, 'GET_ONE_CATEGORY'); }
    },

    async create(req, res) {
        try {
            const { name, description, image_url } = req.body;
            if (!name) return res.status(400).json({ error: 'Name is required' });

            const category = await Category.create({ name, description, image_url });
            res.status(201).json(category);
        } catch (err) { handleError(res, err, 'CREATE_CATEGORY'); }
    },

    async update(req, res) {
        try {
            const { name, description, image_url } = req.body;
            const [updated] = await Category.update({ name, description, image_url }, {
                where: { category_id: req.params.id }
            });
            if (!updated) return res.status(404).json({ error: 'Category not found' });
            res.json({ message: 'Category updated' });
        } catch (err) { handleError(res, err, 'UPDATE_CATEGORY'); }
    },

    async delete(req, res) {
        try {
            const deleted = await Category.destroy({ where: { category_id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Category not found' });
            res.json({ message: 'Category deleted' });
        } catch (err) { handleError(res, err, 'DELETE_CATEGORY'); }
    }
};