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
      // define association here
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