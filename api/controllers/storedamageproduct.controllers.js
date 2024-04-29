const Validator = require("fastest-validator");
const models = require("../models");
const e = require("express");








// function createDamageProduct(req, res) {
//     if (!req.body.date || !req.body.quantity || !req.body.storeId || !req.body.itemId) {
//         return res
//             .status(400)
//             .json({ success: false, message: "Some data is missing" });
//     }
//     if (req.body.quantity.length < 1) {
//         return res
//             .status(400)
//             .json({ success: false, message: "quantity should be more than 1" });
//     }
//     if (req.body.storeId.length < 1) {
//         return res.status(400).json({
//             success: false,
//             message: "storeId should be more than 1",
//         });
//     }
//     if (req.body.itemId.length < 1) {
//         return res.status(400).json({
//             success: false,
//             message: "ItemId should be more than 1",
//         });
//     }
//     const damageproduct = {
//         date: req.body.	date,
//         quantity: req.body.quantity,
//         storeId: req.body.storeId,
//         itemId: req.body.itemId,
//     };
//     models.StoreKeepDamageItem.create(damageproduct)
//         .then((data) => {
//             res.status(201).json({
//                 success: true,
//                 message: "DamageProduct created successfully",
//                 data: data,
//             });
//         })
//         .catch((err) => {
//             res.status(500).json({ success: false, message: "Some error occurred" });
//         });
// }

//add data storekeepdamageitem table
// function addDamageProduct(req, res) {
//     const damageproduct = {
//         date: req.body.date,
//         quantity: req.body.quantity,
//         storeId: req.body.storeId,
//         itemId: req.body.itemId,
//     };
//     models.StoreKeepDamageItem.create(damageproduct)
//         .then((data) => {
//             res.status(201).json({
//                 success: true,
//                 message: "DamageProduct created successfully",
//                 data: data,
//             });
//         })
//         .catch((err) => {
//             res.status(500).json({ success: false, message: "Some error occurred" });
//         });
// }



//get StoreItem from StoreItem table
function getDamageProduct(req, res) {
    models.StoreKeepDamageItem.findAll()
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
   models.StoreKeepDamageItem.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (result === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      })
      .catch((error) => {
        if (error instanceof models.Sequelize.ForeignKeyConstraintError) {
          return res.status(400).json({
            success: false,
            message: "User cannot be deleted because of foreign key constraint",
          });
        }
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          error: error,
        });
      });
  }
  



module.exports = {
    getDamageProduct: getDamageProduct,
    EditDamageProduct: EditDamageProduct,
    deleteDamageProduct: deleteDamageProduct,
};