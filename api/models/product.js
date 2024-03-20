'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    itemName: DataTypes.STRING,
    itemType: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    itemPrice: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};