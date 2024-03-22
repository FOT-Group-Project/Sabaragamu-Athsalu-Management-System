'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreSendToShop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.StoreSendToShop.belongsTo(models.Store, {foreignKey: 'storeId'})
      // models.StoreSendToShop.belongsTo(models.Shop, {foreignKey: 'shopId'})
      // models.StoreSendToShop.belongsTo(models.Product, {foreignKey: 'itemId'})
    }
  }
  StoreSendToShop.init({
    date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreSendToShop',
  });
  return StoreSendToShop;
};