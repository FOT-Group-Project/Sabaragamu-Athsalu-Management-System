const models = require("../models");
const accountant = require("../models/accountant");

async function checkAssociation(req, res) {

  const seller = await models.Seller.findByPk(1, {
    include: [models.Shop],
  });

  const shop = await models.Shop.findByPk(1, {
    include: [models.Seller]
  });
    // const user = await models.User.findByPk(5,{
    //   include:[models.Accountant]
    // });

    // const accountant = await models.Accountant.findByPk(1,{
    //     include:[models.User],
    // });

    // const user = await models.User.findByPk(5,{
    //   include:[models.Admin]
    // });

    // const admin = await models.Admin.findByPk(1,{
    //     include:[models.User],
    // });

    // const user = await models.User.findByPk(1,{
    //     include:[models.Customer]
    // });
  
    // const customer = await models.Admin.findByPk(1,{
    //     include:[models.User],
    // });

    // const user = await models.User.findByPk(1,{
    //     include:[models.Director]
    // });
  
    // const director = await models.Admin.findByPk(1,{
    //     include:[models.User],
    // });

    // const user = await models.User.findByPk(1,{
    //     include:[models.QualityAssurance]
    // });
  
    // const qualityAssurance = await models.Admin.findByPk(1,{
    //     include:[models.User],
    // });

    // const user = await models.User.findByPk(1,{
    //     include:[models.Seller]
    // });
  
    // const seller = await models.Admin.findByPk(1,{
    //     include:[models.User],
    // });

    // const user = await models.User.findByPk(1,{
    //     include:[models.StoreKeeper]
    // });
  
    // const storeKeeper = await models.Admin.findByPk(1,{
    //     include:[models.User],
    // });
  
    //try catch block
    if (seller) {
      res.status(200).json({
        data:seller,
      });
    }else{
      res.status(404).json({
        message: "User not found",
      });
    }
  }
  
  module.exports = {
    checkAssociation: checkAssociation,
  };