const express = require('express');
const associationController = require('../controllers/association.controller');
const router = express.Router();

router.get('/getSellerInfoShop', associationController.getSellerInfoShop);
router.get('/getAllShops', associationController.getAllShops);
router.get('/getStoreKeeperInfoStore', associationController.getStoreKeeperInfoStore);


module.exports = router;