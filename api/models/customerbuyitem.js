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
    buyDate: DataTypes.DATE,
    unitPrice: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    dueAmount: DataTypes.DOUBLE,
    customerId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CustomerBuyItem',
  });
  return CustomerBuyItem;
};