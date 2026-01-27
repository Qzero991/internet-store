const { DataTypes } = require('sequelize');
const sequelize = require('../initConnection');

const Image = sequelize.define('Image', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Images',
  timestamps: false
});

module.exports = Image;
