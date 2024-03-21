'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.StoreItem.belongsTo(models.Store, {foreignKey: 'storeId'})
      models.StoreItem.belongsTo(models.Product, {foreignKey: 'itemId'})
    }
  }
  StoreItem.init({
    quantity: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreItem',
  });
  return StoreItem;
};