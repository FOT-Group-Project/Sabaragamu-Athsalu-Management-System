const models = require("../models");

async function getSellerInfoShop(req, res) {
  // Find shop with id and include the seller
  const shop = await models.Shop.findOne({
    where: {
      id: 2,
    },
    include: [
      {
        model: models.User,
        as: "seller",
      },
    ],
  });

  res.status(200).json({
    data: shop,
  });
}

//Get all shops with their sellers
async function getAllShops(req, res) {
  // Find all shops and include the seller
  const shops = await models.Shop.findAll({
    include: [
      {
        model: models.User,
        as: "seller",
      },
    ],
  });

  res.status(200).json({
    data: shops,
  });
}

module.exports = {
  getSellerInfoShop: getSellerInfoShop,
  getAllShops: getAllShops,
};
