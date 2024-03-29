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
      // models.QaCheckStore.belongsTo(models.QualityAssurance, {foreignKey: 'qaId'})
      // models.QaCheckStore.belongsTo(models.Store, {foreignKey: 'storeId'})
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