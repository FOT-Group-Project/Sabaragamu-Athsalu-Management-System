const Validator = require("fastest-validator");
const e = require("express");
const models = require("../models");

//Add Product
function addProduct(req, res) {
  const product = {
    itemName: req.body.itemName,
    itemType: req.body.itemType,
    manufacturer: req.body.manufacturer,
    itemPrice: req.body.itemPrice,
    sku: req.body.sku,
    storeId: req.body.storeId,
    itemQuantity: req.body.itemQuantity,
  };

  //Validation of the request
  const schema = {
    itemName: { type: "string", optional: false, max: "100" },
    itemType: { type: "string", optional: false, max: "100" },
    manufacturer: { type: "string", optional: false, max: "100" },
    itemPrice: { type: "string", optional: false },
  };

  const v = new Validator();
  const validationResponse = v.validate(product, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: validationResponse.message,
      errors: validationResponse,
    });
  }

  models.Product.create(product)
    .then((result) => {
      res.status(201).json({
        message: "Product added successfully",
        product: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error adding product",
        error: error,
      });
    });
}

//Get Product by PK
function getProduct(req, res) {
  const id = req.params.id;
  models.Product.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error getting product",
        error: error,
      });
    });
}

//Get all Products
function getAllProducts(req, res) {
  models.Product.findAll({
    include: [
      {
        model: models.Store,
        as: "store",
      },
    ],
  })
    .then((result) => {
      if (result) {
        res.status(200).json({
          success: true,
          message: "Products retrieved successfully",
          products: result,
        });
      } else {
        res.status(404).json({
          message: "No products found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error getting products",
        error: error,
      });
    });
}

//Update Product
function updateProduct(req, res) {
  const id = req.params.id;
  const updatedProduct = {
    itemName: req.body.itemName,
    itemType: req.body.itemType,
    manufacturer: req.body.manufacturer,
    itemPrice: req.body.itemPrice,
  };

  //Validation of the request
  const schema = {
    itemName: { type: "string", optional: false, max: "100" },
    itemType: { type: "string", optional: false, max: "100" },
    manufacturer: { type: "string", optional: false, max: "100" },
    itemPrice: { type: "string", optional: false },
  };

  const v = new Validator();
  const validationResponse = v.validate(updatedProduct, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResponse,
    });
  }

  models.Product.update(updatedProduct, { where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Product updated successfully",
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error updating product",
        error: error,
      });
    });
}

//Delete Product
function deleteProduct(req, res) {
  const id = req.params.id;

  models.Product.destroy({ where: { id: id } })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Product deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error deleting product",
        error: error,
      });
    });
}

module.exports = {
  addProduct: addProduct,
  getProduct: getProduct,
  getAllProducts: getAllProducts,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
};
