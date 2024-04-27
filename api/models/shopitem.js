"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShopItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShopItem.belongsTo(models.Shop, {
        foreignKey: "id",
        as: "shop",
      });
      ShopItem.belongsTo(models.Product, {
        foreignKey: "id",
        as: "item",
      });
    }
  }
  ShopItem.init(
    {
      shopId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ShopItem",
    }
  );
  return ShopItem;
};
