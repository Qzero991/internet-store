const { DataTypes } = require('sequelize');
const sequelize = require('../initConnection');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'customer'),
    allowNull: false
  },
  phone_number: DataTypes.STRING,
  shipping_address: DataTypes.TEXT,
  billing_address: DataTypes.TEXT
}, {
  tableName: 'Users',
  timestamps: false
});

module.exports = User;
