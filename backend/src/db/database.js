const { sequelize } = require('./initTables');
const createDefaults = require('./insertDefaultData');

async function connToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        await sequelize.sync();
        console.log('Tables created / updated');

        await createDefaults()

    } catch (err) {
        console.log('Failed to connect to the database',err)
    }
}



module.exports = connToDatabase