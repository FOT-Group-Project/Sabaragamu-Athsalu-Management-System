const { on } = require("nodemon");
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


//Get the storeKeeper of a store
async function getStoreKeeperInfoStore(req, res) {
  // Get the store id from the request
  const storeId = req.params.storeId;

  // Find the store and include the storeKeeper
  const store = await models.Store.findAll( {
    include: [
      {
        model: models.User,
        as: "storeKeeper",
      },
    ],
  });

  res.status(200).json({
    stores: store,
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

//get all stores with their storeKeepers
async function getAllStoreswithStorekeepers(req, res) {
  // // Find all stores and include the storeKeeper
  const storesWithStoreKeepers = await models.Store.findAll({
    include: [
      {
        model: models.User,
        as: "storeKeeper",
      },
    ],
  
  });

  res.status(200).json({
    data: storesWithStoreKeepers,
  });
}

module.exports = {
  getSellerInfoShop: getSellerInfoShop,
  getAllShops: getAllShops,
  getStoreKeeperInfoStore: getStoreKeeperInfoStore,
  getAllStoreswithStorekeepers: getAllStoreswithStorekeepers,
};
