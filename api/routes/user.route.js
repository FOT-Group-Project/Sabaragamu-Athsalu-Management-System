const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/save", userController.save);
router.post("/signout", userController.signout);

module.exports = router;
