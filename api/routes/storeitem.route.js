const express = require("express");
const storeItemController = require("../controllers/storeitem.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/getstoreitems/:storeKeeperId", verifyToken, storeItemController.getStoresItems);
router.get("/getstoreitem/:id", verifyToken, storeItemController.getStoresItemId);
router.put(
  "/senditem/:id/:shopId/:itemId",
  verifyToken,
  storeItemController.sendStoreItemoShop
);

module.exports = router;