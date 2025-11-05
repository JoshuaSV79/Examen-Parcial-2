const express = require("express");
const router = express.Router();
const { generateCertificate } = require("../controllers/certs.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { getTiempo } = require('../controllers/time.controller');

router.get("/time", (req, res) => {
  res.json([
    {
      tiempoMinutos: 3
    }
  ]);
});
router.get("/:attemptId/pdf", verifyToken, generateCertificate);

module.exports = router;