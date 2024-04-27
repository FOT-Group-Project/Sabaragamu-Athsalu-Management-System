const express = require("express");
const shopItemController = require("../controllers/shopItem.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.get("/getshopitems", verifyToken, shopItemController.getShopsItems);

module.exports = router;