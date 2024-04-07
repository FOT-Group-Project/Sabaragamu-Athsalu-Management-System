'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShopReturnDamageItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  ShopReturnDamageItem.init({
    date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    reason: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ShopReturnDamageItem',
  });
  return ShopReturnDamageItem;
};