const { sequelize } = require('./initTables')

async function connToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        await sequelize.sync({ alter: true });
        console.log('Tables created / updated');

    } catch (err) {
        console.log('Failed to connect to the database',err)
    }
}



connToDatabase()

module.exports = sequelize