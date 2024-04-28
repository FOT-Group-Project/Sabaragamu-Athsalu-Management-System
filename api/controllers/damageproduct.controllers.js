const Validator = require("fastest-validator");
const models = require("../models");
const { getStorekeepers } = require("./user.controller");

function createDamageProduct(req, res) {
    if (!req.body.date || !req.body.quantity || !req.body.storeId || !req.body.itemId) {
        return res
            .status(400)
            .json({ success: false, message: "Some data is missing" });
    }
    if (!req.body.date || !req.body.quantity || !req.body.storeId || !req.body.itemId) {
        return res
            .status(400)
            .json({ success: false, message: "Some data is missing" });
    }
    if (req.body.quantity.length < 1) {
        return res
            .status(400)
            .json({ success: false, message: "quantity should be more than 1" });
    }
    if (!req.body.date || !req.body.quantity || !req.body.storeId || !req.body.itemId) {
        return res
            .status(400)
            .json({ success: false, message: "Some data is missing" });
    }
    if (req.body.quantity.length < 1) {
        return res
            .status(400)
            .json({ success: false, message: "quantity should be more than 1" });
    }
    if (req.body.storeId.length < 1) {
        return res.status(400).json({
            success: false,
            message: "storeId should be more than 1",
        });
    }
}