"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StoreItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StoreItem.belongsTo(models.Store, {
        foreignKey: "storeId",
        as: "store",
      });

      StoreItem.belongsTo(models.Product, {
        foreignKey: "itemId",
        as: "item",
      });
    }
  }
  StoreItem.init(
    {
      storeId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StoreItem",
    }
  );
  return StoreItem;
};
