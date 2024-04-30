const express = require('express');
const verifyToken = require("../utils/verifyUser");
const damageproductControllers = require('../controllers/storedamageproduct.controllers');


const router = express.Router();

router.get('/getStoredamageItem',  damageproductControllers.getDamageProduct);
router.patch('/EditStoredamageItem/:id',verifyToken,damageproductControllers.EditDamageProduct);
router.delete('/deleteStoredamageItem/:id',verifyToken ,damageproductControllers.deleteDamageProduct);
router.get('/getstoritem',verifyToken, damageproductControllers. getstoritem);
module.exports = router;