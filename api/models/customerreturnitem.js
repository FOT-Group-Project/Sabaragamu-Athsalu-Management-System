"use strict";
const { Model,Sequelize, DataTypes, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CustomerReturnItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // define association of CustomerReturnItem with Item
      CustomerReturnItem.belongsTo(models.User, {
        foreignKey: "customerId",
        as: "Customer",
      });

      // define association of CustomerReturnItem with Shop
      CustomerReturnItem.belongsTo(models.Shop, {
        foreignKey: "shopId",
        as: "Shop",
      });

      // define association of CustomerReturnItem with Item
      CustomerReturnItem.belongsTo(models.Product, {
        foreignKey: "itemId",
        as: "Product",
      });

      // CustomerReturnItem association
      CustomerReturnItem.belongsTo(models.CustomerBuyItem, {
        foreignKey: "itemId",
        targetKey: "itemId",
        as: "BuyItem",
        scope: {
          customerId: { [Op.col]: "CustomerReturnItem.customerId" },
          shopId: { [Op.col]: "CustomerReturnItem.shopId" },
          buyDateTime: { [Op.col]: "CustomerReturnItem.buyDateTime" },
        },
      });
    }
  }
  CustomerReturnItem.init(
    {
      customerId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      shopId: DataTypes.INTEGER,
      returnDateTime: DataTypes.DATE,
      buyDateTime: DataTypes.DATE,
      reason: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CustomerReturnItem",
    }
  );
  return CustomerReturnItem;
};
