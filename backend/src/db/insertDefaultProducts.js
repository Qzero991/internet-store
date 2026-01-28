const { Product, Category } = require('../db/initTables');
const products = require('../utils/defaultProductsSeed');

module.exports = async function initProducts() {
  const count = await Product.count();
  if (count > 0) {
    console.log('Products already exist, skipping seed');
    return;
  }

  for (const item of products) {
    const category = await Category.findOne({
      where: { name: item.category }
    });

    if (!category) {
      console.warn(`Category "${item.category}" not found, skipping "${item.name}"`);
      continue;
    }

    await Product.create({
      name: item.name,
      short_description: item.short_description,
      long_description: item.long_description,
      price: item.price,
      stock_quantity: item.stock_quantity,
      category_id: category.category_id,
      image_url: item.image_url
    });
  }

  console.log('Default products created');
};
