const models = require("../models");

//Get the seller of a shop
async function getSellerInfoShop(req, res) {
  // Get the shop id from the request
  const shopId = req.params.shopId;

  // Find the shop and include the seller
  const shop = await models.Shop.findAll( {
    include: [
      {
        model: models.User,
        as: "seller",
      },
    ],
  });

  res.status(200).json({
    shops: shop,
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
