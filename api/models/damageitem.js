'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DamageItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      
    }
  }
  DamageItem.init({
    newUnitPrice: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'DamageItem',
  });
  return DamageItem;
};