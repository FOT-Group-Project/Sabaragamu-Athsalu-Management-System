'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShopItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ShopItem.belongsTo(models.Shop, {foreignKey: 'shopId'})
      models.ShopItem.belongsTo(models.Product, {foreignKey: 'itemId'})
    }
  }
  ShopItem.init({
    quantity: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShopItem',
  });
  return ShopItem;
};