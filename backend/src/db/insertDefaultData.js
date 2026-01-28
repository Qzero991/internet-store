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

<<<<<<< HEAD
        await Category.findOrCreate({
=======

        const [clothes] = await Category.findOrCreate({
>>>>>>> 6ba591a (All home page)
            where: { name: 'Clothes' },
            defaults: {
                description: 'Rock shoes, pants, T-shirts',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/clothes.png`
            }
        });
        // Fix for undefined or wrong path
        if (clothes && (clothes.image_url.includes('undefined') || !clothes.image_url.includes('/categories/'))) {
             clothes.image_url = `${process.env.BACKEND_SERVER_URL}/pictures/categories/clothes.png`;
             await clothes.save();
        }

        const [accessories] = await Category.findOrCreate({
            where: { name: 'Accessories' },
            defaults: {
                description: 'Chalk bags, backpacks, bags',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/equipment.png`
            }
        });
        if (accessories && (accessories.image_url.includes('undefined') || !accessories.image_url.includes('/categories/'))) {
             accessories.image_url = `${process.env.BACKEND_SERVER_URL}/pictures/categories/equipment.png`;
             await accessories.save();
        }

        const [equipment] = await Category.findOrCreate({
            where: { name: 'Equipment' },
            defaults: {
                description: 'Ropes, carabiners, belays, chalk',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/accessories.png`
            }
        });
        if (equipment && (equipment.image_url.includes('undefined') || !equipment.image_url.includes('/categories/'))) {
             equipment.image_url = `${process.env.BACKEND_SERVER_URL}/pictures/categories/accessories.png`;
             await equipment.save();
        }

        await initProducts()

    } catch (err) { console.log(err) }
}

module.exports = createDefaults


