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

      //Product belongstomany Store
      Product.belongsToMany(models.Store, {
        through: 'StoreItem',
        as: 'store',
        foreignKey: 'itemId',
      });
    }
  }
  Product.init({
    sku: DataTypes.STRING,
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