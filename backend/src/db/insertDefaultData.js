const { User, Category, Product } = require('./initTables')
const SALT_ROUNDS = 10
const bcrypt = require('bcrypt')
const password = "12345"
const initProducts = require('./insertDefaultProducts')

async function createDefaults() {
    try {
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        await User.findOrCreate({
            where: { email: 'admin' },
            defaults: {
                first_name: 'admin',
                last_name: 'admin',
                password_hash,
                role: 'admin',
            },
        });

        await Category.findOrCreate({
            where: { name: 'Clothes' },
            defaults: {
                description: 'Rock shoes, pants, T-shirts',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/clothes.png`
            }
        });

        await Category.findOrCreate({
            where: { name: 'Accessories' },
            defaults: {
                description: 'Chalk bags, backpacks, bags',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/equipment.png`
            }
        });

        await Category.findOrCreate({
            where: { name: 'Equipment' },
            defaults: {
                description: 'Ropes, carabiners, belays, chalk',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/accessories.png`
            }
        });

        await initProducts()

    } catch (err) { console.log(err) }
}

module.exports = createDefaults


