const express = require('express');
const productsController = require('../controllers/product.controller');
const verifyToken = require("../utils/verifyUser");
const router = express.Router();

router.post('/', verifyToken, productsController.addProduct);
router.get('/:id', productsController.getProduct);
router.get('/', productsController.getAllProducts);
router.patch('/:id', verifyToken, productsController.updateProduct);
router.delete('/:id', verifyToken, productsController.deleteProduct);

module.exports = router;