const express = require("express");
const shopController = require("../controllers/shop.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", verifyToken, shopController.createShop);
router.get("/getshops",  shopController.getShops);
router.delete("/deleteshop/:shopId", verifyToken, shopController.deleteShop);
router.put("/updateshop/:shopId", verifyToken, shopController.updateShop);

module.exports = router;