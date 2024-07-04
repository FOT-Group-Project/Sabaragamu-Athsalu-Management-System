const express = require("express");
const customerReturnItemController = require("../controllers/customerreturnitem.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post(
  "/addcustomerreturnitem",
  verifyToken,
  customerReturnItemController.save
);
router.post(
  "/addcustomerreturnitems",
  verifyToken,
  customerReturnItemController.addreturns
);

module.exports = router;
