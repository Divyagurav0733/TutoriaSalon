const express = require("express");
const router  = express.Router();
const { getPublicCharts } = require("../controllers/publicController");

// Completely open — no auth middleware
router.get("/charts", getPublicCharts);

module.exports = router;
