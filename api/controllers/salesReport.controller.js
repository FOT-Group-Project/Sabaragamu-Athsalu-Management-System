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
            sales: result
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

//for add data for  testing
function addSales(req, res) {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const sales = req.body.map(sale => ({
    customerId: sale.customerId,
    itemId: sale.itemId,
    shopId: sale.shopId,
    buyDateTime: sale.buyDateTime,
    unitPrice: sale.unitPrice,
    type: sale.type,
    quantity: sale.quantity,
    dueAmount: sale.dueAmount
  }));

  models.CustomerBuyItem.bulkCreate(sales)
    .then((result) => {
      res.status(201).json({
        message: "Sales added successfully",
        sales: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding sales",
        error: error,
      });
    });
}

function showSalesReport(req, res) {
  models.CustomerBuyItem.findAll({
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
    ],
  })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Sales report",
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

//show sales by shopId
function showSalesByShopId(req, res){
  models.CustomerBuyItem.findAll({
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
    ],
  })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Sales report",
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

module.exports = {
    showSalesReport: showSalesReport,
    save: save,
    addSales: addSales,
    showSalesByShopId: showSalesByShopId
}