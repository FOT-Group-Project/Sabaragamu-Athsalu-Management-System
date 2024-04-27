const express = require("express");
const storeController = require("../controllers/store.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", verifyToken, storeController.createStore);
router.post("/createstores", verifyToken, storeController.createStores);
router.get("/getstores", verifyToken, storeController.getStores);
router.delete("/deletestore/:storeId", verifyToken, storeController.deleteStore);
router.put("/updatestore/:storeId", verifyToken, storeController.updateStore);

module.exports = router;