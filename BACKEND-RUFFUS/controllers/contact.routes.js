const express = require("express");
const router = express.Router();
const { submitContact, getContactMessages } = require("../controllers/contact.controller");

router.post("/submit", submitContact);
router.get("/messages", getContactMessages); // Para debugging

module.exports = router;