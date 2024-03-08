const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/save", userController.save);
router.post("/create", verifyToken, userController.createUser);
router.put("/update/:userId", verifyToken, userController.updateUser);
router.post("/signout", userController.signout);

module.exports = router;
