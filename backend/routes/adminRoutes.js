const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  getStats,
  adminCancelBooking,
  adminEditBooking,
  sendNotification,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All admin routes require login + isAdmin
router.use(protect, admin);

router.get("/bookings",               getAllBookings);
router.get("/stats",                  getStats);
router.get("/analytics",              getAnalytics);
router.put("/bookings/:id",           adminEditBooking);
router.delete("/bookings/:id/cancel", adminCancelBooking);
router.post("/notify",                sendNotification);

module.exports = router;
