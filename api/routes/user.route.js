const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/save", userController.save);
router.post("/addusers", userController.addUsers);
router.post("/create", verifyToken, userController.createUser);
router.get("/getusers", verifyToken, userController.getUsers);
router.get("/getuser/:userId",verifyToken, userController.getUser);
router.put("/update/:userId", verifyToken, userController.updateUser);
router.post("/signout", userController.signout);
router.delete("/deleteuser/:userId", verifyToken, userController.deleteUser);
router.put("/updateuser/:userId", verifyToken, userController.updateUserTable);
router.get("/getsellers", verifyToken, userController.getSellers);
router.get("/getstorekeepers", verifyToken, userController.getStorekeepers);

module.exports = router;
