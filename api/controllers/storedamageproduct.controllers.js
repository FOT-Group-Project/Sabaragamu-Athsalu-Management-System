const Validator = require("fastest-validator");
const models = require("../models");
const e = require("express");



//get StoredamageItem from StoredamageItem table
function getstoritem(req, res) {
    models.StoreItem.findAll()
        .then((data) => {
            res.status(200).json({ success: true, data: data });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Some error occurred" });
        });
}



//send deta to storekeepdamageitem table cliking on submit button
function addDamageProduct(req, res) {
    
    const newDamageProduct = {
        date: req.body.date,
        quantity: req.body.quantity,
        storeId: req.body.storeId,
        itemId: req.body.itemId,
    };
    models.StoreKeepDamageItem.create(newDamageProduct)
    .then((data) => {
        res.status(201).json({success:true, message:"DamageProduct added successfully", data:data});
    })
    .catch((err) => {
        res.status(500).json({success:false, message:"Some error occurred", error:err});
    });
}



//get StoredamageItem from StoredamageItem table
function getDamageProduct(req, res) {
    models.StoreKeepDamageItem.findAll(
        {
            include: [
                {
                    model: models.Store,
                    as: "store",
                },
                {
                    model: models.Product,
                    as: "item",
                  },
              
            ],
        }
    )
        .then((data) => {
            res.status(200).json({ success: true, data: data });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "Some error occurred" });
        });
}


//Edit function for StoreKeepDamageItem table
function EditDamageProduct(req, res) {
    const id = req.params.id;
    const updateFields = {
        date: req.body.date,
        quantity: req.body.quantity,
        storeId: req.body.storeId,
        itemId: req.body.itemId,
    };

    models.StoreKeepDamageItem.update(updateFields, {
            where: {
                id: id,
            },
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "DamageProduct updated successfully",
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "DamageProduct not found",
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Some error occurred",
                error: error,
            });
        });
}
        

//delete function for StoreKeepDamageItem table
function  deleteDamageProduct(req, res, next) {
    const id = req.params.id;
    models.StoreKeepDamageItem.destroy({
            where: {
                id: id,
            },
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "DamageProduct deleted successfully",
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "DamageProduct not found",
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Some error occurred",
                error: error,
            });
        });
}

//submimit add item form add storekeepdamageitem table
function submitAddItemForm(event) {
    event.preventDefault();
    const newItem = {
      date: date,
      quantity: quantity,
      storeId: storeId,
      itemId: itemId,
    };
    console.log(newItem);
    fetch("/api/stordamageproduct/sumbmitStoredamageItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log("Damage item added successfully");
          setStoreItems((prevItems) => [...prevItems, newItem]);
          setShowModal(false);
        } else {
          console.error("Failed to add damage item");
        }
      })
      .catch((error) => {
        console.error("Failed to add damage item:", error);
      });
  }

module.exports = {
    getDamageProduct: getDamageProduct,
    EditDamageProduct: EditDamageProduct,
    deleteDamageProduct: deleteDamageProduct,
    submitAddItemForm: submitAddItemForm,
    getstoritem: getstoritem,
    addDamageProduct: addDamageProduct,
};