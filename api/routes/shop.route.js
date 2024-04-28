const express = require("express");
const shopController = require("../controllers/shop.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", verifyToken, shopController.createShop);
router.post("/createshops", verifyToken, shopController.addShops);
router.get("/getshops", verifyToken, shopController.getShops);
router.delete("/deleteshop/:shopId", verifyToken, shopController.deleteShop);
router.put("/updateshop/:shopId", verifyToken, shopController.updateShop);
router.get("/getshop/:sellerId", verifyToken, shopController.getShopsBySellerId);

module.exports = router;