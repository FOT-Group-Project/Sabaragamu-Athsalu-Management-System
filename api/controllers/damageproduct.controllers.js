const Validator = require("fastest-validator");
const models = require("../models");
const { getStorekeepers } = require("./user.controller");

function createDamageProduct(req, res) {
    if (!req.body.date || !req.body.quantity || !req.body.storeId || !req.body.itemId) {
        return res
            .status(400)
            .json({ success: false, message: "Some data is missing" });
    }
}