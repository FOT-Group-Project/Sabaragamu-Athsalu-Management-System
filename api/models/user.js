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
      models.User.hasMany(models.Admin, {foreignKey: 'userId'})
      models.User.hasMany(models.Customer, {foreignKey: 'userId'})
      models.User.hasMany(models.Accountant, {foreignKey: 'userId'})
      models.User.hasMany(models.Director, {foreignKey: 'userId'})
      models.User.hasMany(models.Seller, {foreignKey: 'userId'})
      models.User.hasMany(models.StoreKeeper, {foreignKey: 'userId'})
      models.User.hasMany(models.QualityAssurance, {foreignKey: 'userId'})
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