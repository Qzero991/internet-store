const { DataTypes } = require('sequelize');
const sequelize = require('../initConnection');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'paid',
      'shipped',
      'delivered',
      'cancelled'
    ),
    allowNull: false
  },
  total_price: DataTypes.DECIMAL
}, {
  tableName: 'Orders',
  timestamps: false
});

module.exports = Order;
