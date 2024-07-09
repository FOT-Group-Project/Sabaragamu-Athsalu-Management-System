const models = require("../models");
const { Op } = require("sequelize");

// Create and Save a new CustomerReturnItem
function save(req, res) {
  const customerReturnItem = {
    customerId: req.body.customerId,
    itemId: req.body.itemId,
    shopId: req.body.shopId,
    returnDateTime: req.body.returnDateTime,
    buyDateTime: req.body.buyDateTime,
    reason: req.body.reason,
    quantity: req.body.quantity,
  };

  models.User.findByPk(req.body.customerId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      //check if the item exists
      models.Product.findByPk(req.body.itemId)
        .then((item) => {
          if (!item) {
            return res.status(404).json({
              success: false,
              message: "Item not found",
            });
          }

          //check if the shop exists
          models.Shop.findByPk(req.body.shopId)
            .then((shop) => {
              if (!shop) {
                return res.status(404).json({
                  success: false,
                  message: "Shop not found",
                });
              }

              models.CustomerReturnItem.create(customerReturnItem)
                .then((result) => {
                  res.status(201).json({
                    success: true,
                    message: "Customer return item created successfully",
                    sales: result,
                  });
                })
                .catch((error) => {
                  res.status(500).json({
                    success: false,
                    message: "Internal Server Error",
                    error: error,
                  });
                });
            })
            .catch((error) => {
              res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error,
              });
            });
        })
        .catch((error) => {
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    });
}

//add return sales by one function for testing using array
function addreturns(req, res) {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  let returnSales = req.body.map((returnSale) => {
    return {
      customerId: returnSale.customerId,
      itemId: returnSale.itemId,
      shopId: returnSale.shopId,
      returnDateTime: returnSale.returnDateTime,
      buyDateTime: returnSale.buyDateTime,
      reason: returnSale.reason,
      quantity: returnSale.quantity,
    };
  });

  models.CustomerReturnItem.bulkCreate(returnSales)
    .then((result) => {
      res.status(201).json({
        message: "Return sales added successfully",
        sales: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding return sales",
        error: error,
      });
    });
}

//show return sales by shopID
function showReturnSalesByShopId(req, res) {
  models.CustomerReturnItem.findAll({
    where: { shopId: req.params.shopId },
    include: [
      {
        model: models.User,
        as: "Customer",
        attributes: ["firstname", "lastname", "email", "phone"],
      },
      {
        model: models.Product,
        as: "Product",
        attributes: ["itemName"],
      },
      {
        model: models.Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
      {
        model: models.CustomerBuyItem,
        as: "BuyItem",
        attributes: ["buyDateTime", "unitPrice"],
        required: true, // Ensure it's a strict join
        where: {
          [Op.and]: [
            { customerId: { [Op.col]: "CustomerReturnItem.customerId" } },
            { shopId: { [Op.col]: "CustomerReturnItem.shopId" } },
            { buyDateTime: { [Op.col]: "CustomerReturnItem.buyDateTime" } },
          ],
        },
      },
    ],
  })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Sales Returns",
        sales: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    });
}

//get return sales by customerid
function showReturnSalesByCustomerId(req, res) {
  models.CustomerReturnItem.findAll({
    where: { customerId: req.params.customerId },
    include: [
      {
        model: models.User,
        as: "Customer",
        attributes: ["firstname", "lastname", "email", "phone"],
      },
      {
        model: models.Product,
        as: "Product",
        attributes: ["itemName"],
      },
      {
        model: models.Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
      {
        model: models.CustomerBuyItem,
        as: "BuyItem",
        attributes: ["buyDateTime", "unitPrice"],
        required: true, // Ensure it's a strict join
        where: {
          [Op.and]: [
            { customerId: { [Op.col]: "CustomerReturnItem.customerId" } },
            { shopId: { [Op.col]: "CustomerReturnItem.shopId" } },
            { buyDateTime: { [Op.col]: "CustomerReturnItem.buyDateTime" } },
          ],
        },
      },
    ],
  })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Sales Returns",
        sales: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    });
}

//get returns by itemId
function showReturnSalesByItemId(req, res) {
  models.CustomerReturnItem.findAll({
    where: { itemId: req.params.itemId },
    include: [
      {
        model: models.User,
        as: "Customer",
        attributes: ["firstname", "lastname", "email", "phone"],
      },
      {
        model: models.Product,
        as: "Product",
        attributes: ["itemName"],
      },
      {
        model: models.Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
      {
        model: models.CustomerBuyItem,
        as: "BuyItem",
        attributes: ["buyDateTime", "unitPrice"],
        required: true, // Ensure it's a strict join
        where: {
          [Op.and]: [
            { customerId: { [Op.col]: "CustomerReturnItem.customerId" } },
            { shopId: { [Op.col]: "CustomerReturnItem.shopId" } },
            { buyDateTime: { [Op.col]: "CustomerReturnItem.buyDateTime" } },
          ],
        },
      },
    ],
  })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Sales Returns",
        sales: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    });
}

//show all return sales
function showReturnSales(req, res) {
  models.CustomerReturnItem.findAll({
    include: [
      {
        model: models.User,
        as: "Customer",
        attributes: ["firstname", "lastname", "email", "phone"],
      },
      {
        model: models.Product,
        as: "Product",
        attributes: ["itemName"],
      },
      {
        model: models.Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
      {
        model: models.CustomerBuyItem,
        as: "BuyItem",
        attributes: ["buyDateTime", "unitPrice"],
        required: true, // Ensure it's a strict join
        where: {
          [Op.and]: [
            { customerId: { [Op.col]: "CustomerReturnItem.customerId" } },
            { shopId: { [Op.col]: "CustomerReturnItem.shopId" } },
            { buyDateTime: { [Op.col]: "CustomerReturnItem.buyDateTime" } },
          ],
        },
      },
    ],
  })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Sales Returns",
        sales: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    });
}

// Export all functions
module.exports = {
  save: save,
  addreturns: addreturns,
  showReturnSalesByShopId: showReturnSalesByShopId,
  showReturnSalesByCustomerId: showReturnSalesByCustomerId,
  showReturnSales: showReturnSales,
  showReturnSalesByItemId: showReturnSalesByItemId,
};
