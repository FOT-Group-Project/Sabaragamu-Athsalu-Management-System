'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreKeeper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.StoreKeeper.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  StoreKeeper.init({
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreKeeper',
  });
  return StoreKeeper;
};