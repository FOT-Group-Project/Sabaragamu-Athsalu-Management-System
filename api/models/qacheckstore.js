'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QaCheckStore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  QaCheckStore.init({
    date: DataTypes.DATE,
    report: DataTypes.STRING,
    qaId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QaCheckStore',
  });
  return QaCheckStore;
};