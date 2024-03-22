'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreKeepDamageItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.StoreKeepDamageItem.belongsTo(models.Store, {foreignKey: 'storeId'})
      // models.StoreKeepDamageItem.belongsTo(models.Product, {foreignKey: 'itemId'})
    }
  }
  StoreKeepDamageItem.init({
    date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreKeepDamageItem',
  });
  return StoreKeepDamageItem;
};