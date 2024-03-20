const express = require('express');
const productsController = require('../controllers/product.controller');
const router = express.Router();

router.post('/', productsController.addProduct);

module.exports = router;