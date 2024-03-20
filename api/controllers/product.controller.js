
const models = require('../models');

function addProduct(req,res){
    const product = {
        itemName: req.body.itemName,
        itemType: req.body.itemType,
        manufacturer: req.body.manufacturer,
        itemPrice: req.body.itemPrice
    }

    models.Product.create(product).then(result => {
        res.status(201).json({
            message: "Product added successfully",
            product: result
        })
    }).catch(error => {
        res.status(500).json({
            message: "Error adding product",
            error: error
        })
    })
}

module.exports = {
    addProduct: addProduct
}