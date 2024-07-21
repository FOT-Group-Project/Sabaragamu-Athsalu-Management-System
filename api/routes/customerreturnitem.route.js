const express = require("express");
const customerReturnItemController = require("../controllers/customerreturnitem.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/addcustomerreturnitem",verifyToken,customerReturnItemController.save);
router.post("/addcustomerreturnitems",verifyToken,customerReturnItemController.addreturns);
router.get("/getreturnsbyshop/:shopId",verifyToken,customerReturnItemController.showReturnSalesByShopId);
router.get("/getreturnsbycustomer/:customerId",verifyToken,customerReturnItemController.showReturnSalesByCustomerId);
router.get("/getreturns",verifyToken,customerReturnItemController.showReturnSales);
router.get("/getreturnsbyitem/:itemId",verifyToken,customerReturnItemController.showReturnSalesByItemId);

module.exports = router;
