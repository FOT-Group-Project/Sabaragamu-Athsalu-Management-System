'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DamageItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.DamageItem.belongsTo(models.Product, {foreignKey: 'itemId'})
      // models.DamageItem.belongsTo(models.Shop, {foreignKey: 'shopId'})
      // models.DamageItem.belongsTo(models.Store, {foreignKey: 'storeId'})
      
    }
  }
  DamageItem.init({
    newUnitPrice: DataTypes.DOUBLE,
    itemId: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DamageItem',
  });
  return DamageItem;
};