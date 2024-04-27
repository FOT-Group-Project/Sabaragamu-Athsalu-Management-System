const models = require("../models");

function getShopsItems(req, res) {
  models.ShopItem.findAll(
    {
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
    }
  )
    .then((data) => {
      res
        .status(200)
        .json({
          success: true,
          message: "Shop items retrieved successfully",
          shopItems: data,
        });
    })
    .catch((err) => {
      console.error("Error fetching shop items:", err);
      res.status(500).json({ success: false, message: err });
    });
}

module.exports = {
  getShopsItems: getShopsItems,
};