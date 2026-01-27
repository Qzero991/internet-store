const { DataTypes } = require('sequelize');
const sequelize = require('../initConnection');

const OrderProduct = sequelize.define('OrderProduct', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price_at_purchase: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  tableName: 'Order_products',
  timestamps: false
});

module.exports = OrderProduct;
