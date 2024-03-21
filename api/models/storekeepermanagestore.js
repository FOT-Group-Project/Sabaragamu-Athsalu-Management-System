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
      models.StoreKeeperManageStore.belongsTo(models.Store, {foreignKey: 'storeId'})
      models.StoreKeeperManageStore.belongsTo(models.StoreKeeper, {foreignKey: 'storeKeeperId'})
    }
  }
  StoreKeeperManageStore.init({
    date: DataTypes.DATE,
    storeKeeperId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreKeeperManageStore',
  });
  return StoreKeeperManageStore;
};