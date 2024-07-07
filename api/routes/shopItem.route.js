const express = require("express");
const shopItemController = require("../controllers/shopItem.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/getshopitems/:sellerId", verifyToken, shopItemController.getShopsItems);
router.get("/getshopitem/:id", verifyToken, shopItemController.getShopsItemId);
router.put(
  "/senditem/:id/:shopId/:itemId",
  verifyToken,
  shopItemController.sendShopItemoShop
);
router.post("/buyitems", verifyToken, shopItemController.buyItems);

module.exports = router;
