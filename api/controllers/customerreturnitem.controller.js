const models = require("../models");

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



module.exports = {
    save: save
}
