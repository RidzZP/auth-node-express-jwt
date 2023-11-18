const express = require("express");
const userModel = require("../controllers/userController");
const validateToken = require("../middleware/VerifyToken");
const refToken = require("../controllers/refreshToken");

const router = express.Router();

router.get("/", validateToken, userModel.getAllUser);
router.post("/register", userModel.register);
router.post("/login", userModel.login);
router.get("/token", refToken);
router.delete("/logout", userModel.logout);

module.exports = router;
