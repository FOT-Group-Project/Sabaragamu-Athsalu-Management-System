const express = require('express');
const verifyToken = require("../utils/verifyUser");
const damageproductControllers = require('../controllers/storedamageproduct.controllers');
const router = express.Router();

router.get('/getStoredamageItem',  damageproductControllers.getDamageProduct);
//router.post('/addDamageProduct', damageproductControllers.addDamageProduct);

module.exports = router;