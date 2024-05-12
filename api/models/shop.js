'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shop.belongsTo(models.User, {
        foreignKey: 'sellerId',
        as: 'seller',
        onDelete: 'RESTRICT',
      });
    }
  }
  Shop.init({
    shopName: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    sellerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shop',
  });
  return Shop;
};