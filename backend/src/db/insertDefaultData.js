const { User, Category, Product } = require('./initTables')
const SALT_ROUNDS = 10
const bcrypt = require('bcrypt')
const password = "12345678"
const initProducts = require('./insertDefaultProducts')

async function createDefaults() {
    try {
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        await User.findOrCreate({
            where: { email: 'admin@admin.com' },
            defaults: {
                first_name: 'admin',
                last_name: 'admin',
                password_hash,
                role: 'admin',
            },
        });


        const [clothes] = await Category.findOrCreate({
            where: { name: 'Clothes' },
            defaults: {
                description: 'Rock shoes, pants, T-shirts',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/clothes.png`
            }
        });
        if (clothes && clothes.image_url && clothes.image_url.includes('undefined')) {
             clothes.image_url = `${process.env.BACKEND_SERVER_URL}/pictures/clothes.png`;
             await clothes.save();
        }

        const [accessories] = await Category.findOrCreate({
            where: { name: 'Accessories' },
            defaults: {
                description: 'Chalk bags, backpacks, bags',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/equipment.png`
            }
        });
        if (accessories && accessories.image_url && accessories.image_url.includes('undefined')) {
             accessories.image_url = `${process.env.BACKEND_SERVER_URL}/pictures/equipment.png`;
             await accessories.save();
        }

        const [equipment] = await Category.findOrCreate({
            where: { name: 'Equipment' },
            defaults: {
                description: 'Ropes, carabiners, belays, chalk',
                image_url: `${process.env.BACKEND_SERVER_URL}/pictures/categories/accessories.png`
            }
        });
        if (equipment && equipment.image_url && equipment.image_url.includes('undefined')) {
             equipment.image_url = `${process.env.BACKEND_SERVER_URL}/pictures/accessories.png`;
             await equipment.save();
        }

        await initProducts()

    } catch (err) { console.log(err) }
}

module.exports = createDefaults


