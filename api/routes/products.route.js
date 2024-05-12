const express = require('express');
const productsController = require('../controllers/product.controller');
const verifyToken = require("../utils/verifyUser");
const router = express.Router();

router.post('/addproduct/',  productsController.addProduct);
router.post('/addproducts/', productsController.addProducts);
router.get('/getproduct/:id', productsController.getProduct);
router.get('/getallproducts/', productsController.getAllProducts);
router.patch('/updateproduct/:id', verifyToken, productsController.updateProduct);
router.delete('/deleteproduct/:id', verifyToken, productsController.deleteProduct);

module.exports = router;