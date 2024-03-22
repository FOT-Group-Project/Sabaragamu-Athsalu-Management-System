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
      User.hasMany(sequelize.define('Accountant'));
      User.hasMany(sequelize.define('Admin'));
      User.hasMany(sequelize.define('Customer'));
      User.hasMany(sequelize.define('Director'));
      User.hasMany(sequelize.define('QualityAssurance'));
      User.hasMany(sequelize.define('Seller'));
      User.hasMany(sequelize.define('StoreKeeper'));      
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