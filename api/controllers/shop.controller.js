const models = require("../models");

function createShop(req,res){
    if(!req.body.shopName || !req.body.phone || !req.body.address){
        return res.status(400).json({success:false, message:"Some data is missing"});
    }
    if(req.body.phone.length !== 10){
        return res.status(400).json({success:false, message:"Phone number should be 10 digits"});
    }
    if(req.body.address.length < 3){
        return res.status(400).json({success:false, message:"Address should be more than 10 characters"});
    }
    if(req.body.shopName.length < 3){
        return res.status(400).json({success:false, message:"Shop name should be more than 3 characters"});
    }

    const shop = {
        shopName: req.body.shopName,
        phone: req.body.phone,
        address: req.body.address,
        sellerId: req.body.sellerId
    };
    models.Shop.create(shop)
    .then(data => {
        res.status(201).json({success:true, message:"Shop created successfully", shop:data});
    })
    .catch(err => {
        res.status(500).json({success:false, message:"Some error occurred", error:err});
    });
}

function getShops(req,res){
    models.Shop.findAll()
    .then(data => {
        res.status(200).json({success:true, message:"Shops retrieved successfully", shops:data});
    })
    .catch(err => {
        console.error("Error fetching shops:", err);
        res.status(500).json({success:false, message:err});
    });
}

function deleteShop(req,res){
    const shopId = req.params.shopId;
    models.Shop.destroy({
        where: {id: shopId}
    })
    .then(num => {
        if(num == 1){
            res.status(200).json({success:true, message:"Shop deleted successfully"});
        } else {
            res.status(404).json({success:false, message:"Shop not found"});
        }
    })
    .catch(err => {
        res.status(500).json({success:false, message:"Some error occurred", error:err});
    });
}

function updateShop(req,res){
    const shopId = req.params.shopId;
    if(!req.body.shopName || !req.body.phone || !req.body.address){
        return res.status(400).json({success:false, message:"Some data is missing"});
    }
    if(req.body.phone.length !== 10){
        return res.status(400).json({success:false, message:"Phone number should be 10 digits"});
    }
    if(req.body.address.length < 3){
        return res.status(400).json({success:false, message:"Address should be more than 10 characters"});
    }
    if(req.body.shopName.length < 3){
        return res.status(400).json({success:false, message:"Shop name should be more than 3 characters"});
    }

    const shop = {
        shopName: req.body.shopName,
        phone: req.body.phone,
        address: req.body.address
    };
    models.Shop.update(shop, {
        where: {id: shopId}
    })
    .then(num => {
        if(num == 1){
            res.status(200).json({success:true, message:"Shop updated successfully"});
        } else {
            res.status(404).json({success:false, message:"Shop not found"});
        }
    })
    .catch(err => {
        res.status(500).json({success:false, message:"Some error occurred", error:err});
    });
}

module.exports = {
    createShop: createShop,
    getShops: getShops,
    deleteShop: deleteShop,
    updateShop: updateShop
};