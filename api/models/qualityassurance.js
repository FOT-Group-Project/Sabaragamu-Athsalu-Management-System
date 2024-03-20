'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QualityAssurance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  QualityAssurance.init({
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QualityAssurance',
  });
  return QualityAssurance;
};