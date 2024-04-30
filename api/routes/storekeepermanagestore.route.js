const express = require("express");
const storekeepermanagestoreController = require("../controllers/storekeepermanagestore.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/assignstorekeeper", verifyToken, storekeepermanagestoreController.assignStoreKeeper);

module.exports = router;
