'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerReturnItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomerReturnItem.init({
    customerId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER,
    returnDateTime: DataTypes.DATE,
    buyDateTime: DataTypes.DATE,
    reason: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CustomerReturnItem',
  });
  return CustomerReturnItem;
};