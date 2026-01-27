const { DataTypes } = require('sequelize');
const sequelize = require('../initConnection');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Products',
  timestamps: false
});

module.exports = Product;
