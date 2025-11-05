const express = require("express");
const router = express.Router();
const { submitContact, getContactMessages } = require("../controllers/contact.controller"); // ← "controllers" minúscula

router.post("/submit", submitContact);
router.get("/messages", getContactMessages);

module.exports = router;