'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.Store.hasMany(models.QaCheckStore, {foreignKey: 'storeId'})
      // models.Store.hasMany(models.DamageItem, {foreignKey: 'storeId'})
      //models.Store.hasMany(models.Product, {foreignKey: 'storeId'})
      // models.Store.hasMany(models.StoreKeeper, {foreignKey: 'storeId'})
    }
  }
  Store.init({
    storeName: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};