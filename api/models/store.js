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
      //Store belongsToMany User as storeKeeper
      Store.belongsToMany(models.User, {
        through: 'StoreKeeperManageStore',
        as: 'storeKeeper',
        foreignKey: 'storeId',
      });
      
      //Store belongstomany Product 
      Store.belongsToMany(models.Product, {
        through: 'StoreItem',
        as: 'product',
        foreignKey: 'storeId',
      });
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