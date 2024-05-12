'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Shop, {
        foreignKey: 'sellerId',
        as: 'seller',
        onDelete: 'RESTRICT',
      });

      //User belongsToMany Store as storeKeeper
      User.belongsToMany(models.Store, {
        through: 'StoreKeeperManageStore',
        as: 'storeKeeper',
        foreignKey: 'storeKeeperId',
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    profilepicurl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};