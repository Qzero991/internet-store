const { Product, Category } = require('../db/initTables');

const handleError = (res, err, context) => {
    console.error(`${context} ERROR:`, err);
    return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {
    async getAll(req, res) {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (err) { handleError(res, err, 'GET_PRODUCTS'); }
    },

    async getOne(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [Category]
            });
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (err) { handleError(res, err, 'GET_PRODUCT'); }
    },

    async create(req, res) {
        try {
            const { name, description, price, stock_quantity, category_id, image_url } = req.body;
            if (!name || !price || !category_id) {
                return res.status(400).json({ error: 'Missing name, price or category_id' });
            }

            const product = await Product.create({ name, description, price, stock_quantity, category_id, image_url });
            res.status(201).json(product);
        } catch (err) { handleError(res, err, 'CREATE_PRODUCT'); }
    },

    async update(req, res) {
        try {
            const [updated] = await Product.update(req.body, {
                where: { product_id: req.params.id }
            });
            if (!updated) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated' });
        } catch (err) { handleError(res, err, 'UPDATE_PRODUCT'); }
    },

    async delete(req, res) {
        try {
            await Product.destroy({ where: { product_id: req.params.id } });
            res.json({ message: 'Product deleted' });
        } catch (err) { handleError(res, err, 'DELETE_PRODUCT'); }
    }
};