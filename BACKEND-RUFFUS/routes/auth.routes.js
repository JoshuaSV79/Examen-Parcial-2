const express = require("express");
const router = express.Router();
const { login, logout, getProfile } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);

module.exports = router;
