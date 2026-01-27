const { DataTypes } = require('sequelize');
const sequelize = require('../initConnection');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Categories',
  timestamps: false
});

module.exports = Category;
