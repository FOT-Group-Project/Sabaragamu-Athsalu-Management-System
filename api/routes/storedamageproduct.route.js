const express = require('express');
const verifyToken = require("../utils/verifyUser");
const damageproductControllers = require('../controllers/storedamageproduct.controllers');


const router = express.Router();

router.get('/getStoredamageItem',  damageproductControllers.getDamageProduct);
router.patch('/EditStoredamageItem/:id',verifyToken,damageproductControllers.EditDamageProduct);
router.delete('/deleteStoredamageItem/:id',verifyToken ,damageproductControllers.deleteDamageProduct);
router.get('/getstoritem',verifyToken, damageproductControllers. getstoritem);
router.post('sumbmitStoredamageItem',verifyToken, damageproductControllers.submitAddItemForm);
router.post('/addStoredamageItem',verifyToken, damageproductControllers.addDamageProduct);
module.exports = router;