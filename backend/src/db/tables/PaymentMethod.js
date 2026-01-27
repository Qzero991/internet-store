const { DataTypes } = require('sequelize');
const sequelize = require('../initConnection');

const PaymentMethod = sequelize.define('PaymentMethod', {
  payment_method_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  card_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiration_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Payment_Methods',
  timestamps: false
});

module.exports = PaymentMethod;
