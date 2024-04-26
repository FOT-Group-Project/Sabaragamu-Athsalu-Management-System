const models = require("../models");

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
    showSalesReport: showSalesReport
}