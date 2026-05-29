const express = require("express");
const router  = express.Router();
const { getStylists, getStylist, createStylist, updateStylist, deleteStylist } = require("../controllers/stylistController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public
router.get("/",    getStylists);
router.get("/:id", getStylist);

// Admin only
router.post("/",       protect, admin, createStylist);
router.put("/:id",     protect, admin, updateStylist);
router.delete("/:id",  protect, admin, deleteStylist);

module.exports = router;
