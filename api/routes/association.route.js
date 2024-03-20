const express = require("express");
const associationController = require("../controllers/association.controller");

const router = express.Router();

router.get("/associations", associationController.getAssociations);

module.exports = router;