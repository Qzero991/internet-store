
const { User } = require('./initTables');
const bcrypt = require('bcrypt');
const sequelize = require('./initConnection');

async function fixAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Connected');
        
        const hash = await bcrypt.hash("12345678", 10);
        await User.update({ password_hash: hash }, { where: { email: 'admin@admin.com' } });
        console.log('Admin password updated to 12345678');
    } catch (e) {
        console.error(e);
    }
}

fixAdmin();
