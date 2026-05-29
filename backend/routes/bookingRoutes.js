const express = require("express");
const router = express.Router();
const {
  getSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.get("/slots",          getSlots);
router.post("/",              protect, createBooking);
router.get("/my",             protect, getMyBookings);
router.put("/:id/cancel",     protect, cancelBooking);

module.exports = router;
