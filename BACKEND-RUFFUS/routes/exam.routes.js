const express = require("express");
const router = express.Router();
const { startExam, submitExam } = require("../controllers/exams.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/start", verifyToken, startExam);
router.post("/submit", verifyToken, submitExam);

module.exports = router;