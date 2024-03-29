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
      // models.ShopReturnDamageItem.belongsTo(models.Shop, {foreignKey: 'shopId'})
      // models.ShopReturnDamageItem.belongsTo(models.Product, {foreignKey: 'itemId'})
    }
  }
  ShopReturnDamageItem.init({
    date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    shopId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShopReturnDamageItem',
  });
  return ShopReturnDamageItem;
};