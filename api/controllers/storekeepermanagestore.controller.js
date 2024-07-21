const Validator = require("fastest-validator");
const models = require("../models");

//Assign StoreKeeper to a store
function assignStoreKeeper(req, res) {
  if (!req.body.storeId || !req.body.storeKeeperId || !req.body.date) {
    return res
      .status(400)
      .json({ success: false, message: "Some data is missing" });
  }

  const storeKeeper = {
    storeId: parseInt(req.body.storeId),
    storeKeeperId: parseInt(req.body.storeKeeperId),
    date: new Date(req.body.date),
  };

  //Validate the data
  const schema = {
    storeId: { type: "number", positive: true, integer: true },
    storeKeeperId: { type: "number", positive: true, integer: true },
    date: { type: "date"},    
  };

  const v = new Validator();
  const validationResponse = v.validate(storeKeeper, schema);

 

  if (validationResponse !== true) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationResponse,
    });
  }

  

  models.StoreKeeperManageStore.create(storeKeeper)
    .then((data) => {
      res.status(201).json({
        success: true,
        message: "StoreKeeper assigned successfully",
        storeKeeper: data,
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

//Get store by storekeeper id
function getStoresByStoreKeeperId(req, res) {
  models.StoreKeeperManageStore.findAll({
    where: { storeKeeperId: req.params.storeKeeperId },
    include: [
      {
        model: models.Store,
        as: "store",
      },
    ],
  })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "StoreKeeper stores retrieved successfully",
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

module.exports = {
    assignStoreKeeper: assignStoreKeeper,
    getStoresByStoreKeeperId: getStoresByStoreKeeperId,
};