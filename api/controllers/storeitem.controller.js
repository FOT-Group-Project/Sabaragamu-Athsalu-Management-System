const e = require("express");
const models = require("../models");
const { parse } = require("dotenv");

function sendStoreItemoShop(req, res) {
  models.StoreItem.findOne({
    where: { id: req.params.id },
  }).then((itemData) => {
    quantity = parseInt(itemData.quantity) - parseInt(req.body.quantity);

    if (quantity < 0) {
      res.status(404).json({
        success: false,
        message: "Not enough quantity",
      });
      return;
    }

    models.StoreItem.update(
      { quantity: itemData.quantity - req.body.quantity },
      { where: { id: req.params.id } }
    )
      .then((data) => {
        if (data == 1) {
          models.ShopItem.findOne({
            where: { shopId: req.params.shopId, itemId: req.params.itemId },
            include: [
              {
                model: models.Shop,
                as: "shop",
              },
              {
                model: models.Product,
                as: "item",
              },
            ],
          })
            .then((dataB) => {
              if (dataB != null) {
                quantity =
                  parseInt(dataB.quantity) + parseInt(req.body.quantity);
                models.ShopItem.update(
                  { quantity: quantity },
                  {
                    where: {
                      shopId: req.params.shopId,
                      itemId: req.params.itemId,
                    },
                  }
                )
                  .then((data) => {
                    res.status(200).json({
                      success: true,
                      message: "Updated already existing shop item",
                      shopItem: data,
                    });
                  })
                  .catch((err) => {
                    console.error("Error sending shop item:", err);
                    res.status(500).json({ success: false, message: err });
                  });
              } else {
                models.ShopItem.create({
                  shopId: req.params.shopId,
                  itemId: req.params.itemId,
                  quantity: req.body.quantity,
                })
                  .then((data) => {
                    res.status(200).json({
                      success: true,
                      message: "Created new shop item",
                      shopItem: data,
                    });
                  })
                  .catch((err) => {
                    console.error("Error sending shop item:", err);
                    res.status(500).json({ success: false, message: err });
                  });
              }
            })
            .catch((err) => {
              console.error("Error fetching shop item:", err);
              res.status(500).json({ success: false, message: err });
            });
        } else {
          res.status(404).json({
            success: false,
            message: "Shop item not found",
          });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ success: false, message: "Some error occurred" });
      });
  });
}

function getStoresItemId(req, res) {
  models.StoreItem.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: models.Store,
        as: "store",
      },
      {
        model: models.Product,
        as: "item",

        include: [
          {
            model: models.Shop,
            as: "shop",
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Store item retrieved successfully",
        storeItem: data,
      });
    })
    .catch((err) => {
      console.error("Error fetching store item:", err);
      res.status(500).json({ success: false, message: err });
    });
}

function getStoresItems(req, res) {
  models.StoreItem.findAll({
    where: { storeId: req.params.storeKeeperId},
    include: [
      {
        model: models.Store,
        as: "store",
      },
      {
        model: models.Product,
        as: "item",
      },
    ],
  })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Store items retrieved successfully",
        storeItems: data,
      });
    })
    .catch((err) => {
      console.error("Error fetching store items:", err);
      res.status(500).json({ success: false, message: err });
    });
}

module.exports = {
  getStoresItems: getStoresItems,
  getStoresItemId: getStoresItemId,
  sendStoreItemoShop: sendStoreItemoShop,
};
