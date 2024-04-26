const models = require("../models");

//for add data for  testing
function save(req, res){
  const customerBuyItem ={
    customerId: req.body.customerId,
    itemId: req.body.itemId,
    shopId: req.body.shopId,
    buyDateTime: req.body.buyDateTime,
    unitPrice: req.body.unitPrice,
    type: req.body.type,
    quantity: req.body.quantity,
    dueAmount: req.body.dueAmount
  }

  models.User.findByPk(req.body.customerId).then((user)=>{
    if(!user){
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      })
    }

    //check if the item exists
    models.Product.findByPk(req.body.itemId).then((item)=>{
      if(!item){
        return res.status(404).json({
          success: false,
          message: "Item not found"
        })
      }

      //check if the shop exists
      models.Shop.findByPk(req.body.shopId).then((shop)=>{
        if(!shop){
          return res.status(404).json({
            success: false,
            message: "Shop not found"
          })
        }

        models.CustomerBuyItem.create(customerBuyItem).then((result)=>{
          res.status(201).json({
            success: true,
            message: "Customer buy item created successfully",
            data: result
          })
        }).catch((error)=>{
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
          })
        })
      }).catch((error)=>{
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
          error: error
        })
      })
    })
  })
}

function showSalesReport(req, res) {
  models.CustomerBuyItem.findAll()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Sales report",
        data: result,
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
    showSalesReport: showSalesReport,
    save: save
}