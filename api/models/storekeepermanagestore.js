'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreKeeperManageStore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StoreKeeperManageStore.init({
    date: DataTypes.DATE,
    storeKeeperId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'StoreKeeperManageStore',
  });
  return StoreKeeperManageStore;
};