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
    }
  }
  StoreKeepDamageItem.init({
    storeId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreKeepDamageItem',
  });
  return StoreKeepDamageItem;
};