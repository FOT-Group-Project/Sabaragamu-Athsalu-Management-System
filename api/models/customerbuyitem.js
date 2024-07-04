'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerBuyItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association of CustomerBuyItem with User
      CustomerBuyItem.belongsTo(models.User, {
        foreignKey: 'customerId',
        as: 'Customer',
      });
      // define association of CustomerBuyItem with Shop
      CustomerBuyItem.belongsTo(models.Shop, {
        foreignKey: 'shopId',
        as: 'Shop',
      });
      // define association of CustomerBuyItem with Item
      CustomerBuyItem.belongsTo(models.Product, {
        foreignKey: 'itemId',
        as: 'Product',
      });
    }
  }
  
  CustomerBuyItem.init({
    customerId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER,
    buyDateTime: DataTypes.DATE,
    unitPrice: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    dueAmount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'CustomerBuyItem',
  });
  return CustomerBuyItem;
};