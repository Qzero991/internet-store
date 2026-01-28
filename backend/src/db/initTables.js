const sequelize = require('./initConnection');

const Category = require('./tables/Category');
const User = require('./tables/User');
const Product = require('./tables/Product');
const CartItem = require('./tables/CartItem');
const Order = require('./tables/Order');
const OrderProduct = require('./tables/OrderProduct');
const PaymentMethod = require('./tables/PaymentMethod');
const Review = require('./tables/Review');


Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });


User.hasMany(CartItem, { foreignKey: 'user_id' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });


Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });


User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });


Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: 'order_id'
});
Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: 'product_id'
});


User.hasMany(Review, { foreignKey: 'user_id' });
Product.hasMany(Review, { foreignKey: 'product_id' });


User.hasMany(PaymentMethod, { foreignKey: 'user_id' });
PaymentMethod.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Category,
  User,
  Product,
  CartItem,
  Order,
  OrderProduct,
  PaymentMethod,
  Review
};
