const { User, Category } = require('./initTables')
const SALT_ROUNDS = 10
const bcrypt = require('bcrypt')
const password = "12345"

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
            where: { name: 'phones' },
        });


    } catch (err) { console.log(err) }
}

module.exports = createDefaults


