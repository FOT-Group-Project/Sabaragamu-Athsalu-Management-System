const Validator = require("fastest-validator");
const models = require("../models");

function createStore(req, res) {
  if (!req.body.storeName || !req.body.phone || !req.body.address) {
    return res
      .status(400)
      .json({ success: false, message: "Some data is missing" });
  }
  if (req.body.phone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number should be 10 digits" });
  }
  if (req.body.address.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Address should be more than 10 characters",
    });
  }
  if (req.body.storeName.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Store name should be more than 3 characters",
    });
  }

  const store = {
    storeName: req.body.storeName,
    phone: req.body.phone,
    address: req.body.address,
    storeKeeperId: req.body.storeKeeperId,
  };
  models.Store.create(store)
    .then((data) => {
      res.status(201).json({
        success: true,
        message: "Store created successfully",
        store: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Some error occurred",
        error: err,
      });
    });
}

// Create multiple stores
function createStores(req, res) {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ success: false, message: "Invalid request body" });
  }

  const invalidShops = req.body.filter(shop => !shop.storeName || !shop.phone || !shop.address || shop.phone.length !== 10 || shop.address.length < 3 || shop.storeName.length < 3);
  if (invalidShops.length > 0) {
    return res.status(400).json({ success: false, message: "Some data is missing or invalid in the shops", invalidShops });
  }

  const stores = req.body.map(shop => ({
    storeName: shop.storeName,
    phone: shop.phone,
    address: shop.address,
  }));

  models.Store.bulkCreate(stores)
    .then((data) => {
      res.status(201).json({
        success: true,
        message: "Stores created successfully",
        stores: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Some error occurred",
        error: err,
      });
    });
}


function getStores(req, res) {
  models.Store.findAll()
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Stores retrieved successfully",
        stores: data,
      });
    })
    .catch((err) => {
      console.error("Error fetching stores:", err);
      res.status(500).json({ success: false, message: err });
    });
}

function deleteStore(req, res) {
  const storeId = req.params.storeId;
  models.Store.destroy({ where: { id: storeId } })
    .then((data) => {
      if (data == 1) {
        res.status(200).json({
          success: true,
          message: "Store deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Some error occurred" });
    });
}

function updateStore(req, res) {
  const storeId = req.params.storeId;

  if (!req.body.storeName || !req.body.phone || !req.body.address) {
    return res
      .status(400)
      .json({ success: false, message: "Some data is missing" });
  }
  if (req.body.phone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number should be 10 digits" });
  }
  if (req.body.address.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Address should be more than 10 characters",
    });
  }
  if (req.body.storeName.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Store name should be more than 3 characters",
    });
  }

  const store = {
    storeName: req.body.storeName,
    phone: req.body.phone,
    address: req.body.address,
  };

  models.Store.update(store, { where: { id: storeId } })
    .then((data) => {
      if (data == 1) {
        res.status(200).json({
          success: true,
          message: "Store updated successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Some error occurred" });
    });
}

module.exports = {
  createStore: createStore,
  getStores: getStores,
  deleteStore: deleteStore,
  updateStore: updateStore,
  createStores: createStores,
};
