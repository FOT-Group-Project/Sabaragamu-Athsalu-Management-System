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
      StoreKeeperManageStore.belongsTo(models.User, {
        foreignKey: 'storeKeeperId',
        as: 'storeKeeper',
        onDelete: 'RESTRICT',
      });

      StoreKeeperManageStore.belongsTo(models.Store, {
        foreignKey: 'storeId',
        as: 'store',
        onDelete: 'RESTRICT',
      });
    }
  }
  StoreKeeperManageStore.init({
    storeKeeperId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'StoreKeeperManageStore',
  });
  return StoreKeeperManageStore;
};