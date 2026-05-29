const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const User    = require("../models/User");
const Stylist = require("../models/Stylist");
const { sendCancellationEmail, sendCustomEmail } = require("../utils/sendEmail");

// @desc    Get all bookings with filters
// @route   GET /api/admin/bookings?date=&gender=&status=&stylist=
// @access  Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const { date, gender, status, stylist } = req.query;
  const filter = {};

  if (date)    filter.date   = date;
  if (gender)  filter.gender = gender;
  if (status)  filter.status = status;
  if (stylist) filter.stylist = stylist;

  const bookings = await Booking.find(filter)
    .populate("stylist", "name photo")
    .populate("user", "name email")
    .sort({ date: -1, timeSlot: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const [total, upcoming, todayCount, cancelled, revenue] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: "upcoming" }),
    Booking.countDocuments({ date: today }),
    Booking.countDocuments({ status: "cancelled" }),
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]),
  ]);

  // Bookings by gender
  const genderStats = await Booking.aggregate([
    { $group: { _id: "$gender", count: { $sum: 1 } } },
  ]);

  // Top services
  const topServices = await Booking.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: "$serviceName", count: { $sum: 1 }, revenue: { $sum: "$price" } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    success: true,
    data: {
      total,
      upcoming,
      today: todayCount,
      cancelled,
      revenue: revenue[0]?.total || 0,
      genderStats,
      topServices,
    },
  });
});

// @desc    Admin cancel any booking
// @route   DELETE /api/admin/bookings/:id/cancel
// @access  Admin
const adminCancelBooking = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const booking = await Booking.findById(req.params.id).populate("stylist", "name");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = "cancelled";
  booking.adminNote = message || "Cancelled by admin";
  await booking.save();

  // Always notify customer by email when admin cancels
  sendCancellationEmail({
    to:           booking.email,
    customerName: booking.customerName,
    bookingId:    booking._id.toString().slice(-8).toUpperCase(),
    serviceName:  booking.serviceName,
    stylistName:  booking.stylist?.name || "Your Stylist",
    date:         booking.date,
    timeSlot:     booking.timeSlot,
    cancelledBy:  "admin",
    message:      message || "Your appointment has been cancelled by our team. We apologise for any inconvenience. Please book a new appointment at your convenience.",
  }).catch((err) => console.log("Cancellation email error (non-critical):", err.message));

  res.json({ success: true, message: "Booking cancelled and customer notified", data: booking });
});

// @desc    Admin edit a booking (date/time/status)
// @route   PUT /api/admin/bookings/:id
// @access  Admin
const adminEditBooking = asyncHandler(async (req, res) => {
  const { date, timeSlot, status, stylist, adminNote } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (date)      booking.date      = date;
  if (timeSlot)  booking.timeSlot  = timeSlot;
  if (status)    booking.status    = status;
  if (stylist)   booking.stylist   = stylist;
  if (adminNote) booking.adminNote = adminNote;

  await booking.save();
  await booking.populate("stylist", "name photo");

  res.json({ success: true, data: booking });
});

// @desc    Send notification email to customer
// @route   POST /api/admin/notify
// @access  Admin
const sendNotification = asyncHandler(async (req, res) => {
  const { bookingId, subject, message, channel } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (channel === "email" || channel === "both") {
    await sendCustomEmail({
      to: booking.email,
      customerName: booking.customerName,
      subject: subject || "Message from Tutoria Salon",
      message,
    });
  }


  res.json({
    success: true,
    message: "Notification sent",
  });
});

// (exports moved to bottom)

// Already exported above – we just add getDetailedStats separately
// @desc    Get rich analytics data for Statistics page
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  // Last 30 days revenue & bookings per day
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysStr = thirtyDaysAgo.toISOString().split("T")[0];

  const [
    topServices,
    topStylists,
    revenueByDay,
    bookingsByStatus,
    bookingsByGender,
    bookingsByPayment,
    monthlyRevenue,
  ] = await Promise.all([
    // Top 10 most booked services
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$serviceName", count: { $sum: 1 }, revenue: { $sum: "$price" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    // Top stylists by bookings
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$stylist", count: { $sum: 1 }, revenue: { $sum: "$price" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "stylists",
          localField: "_id",
          foreignField: "_id",
          as: "stylistInfo",
        },
      },
      { $unwind: "$stylistInfo" },
      {
        $project: {
          name: "$stylistInfo.name",
          count: 1,
          revenue: 1,
        },
      },
    ]),

    // Revenue & bookings per day for last 30 days
    Booking.aggregate([
      { $match: { date: { $gte: thirtyDaysStr }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: "$date",
          revenue: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Bookings by status
    Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Bookings by gender
    Booking.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]),

    // Bookings by payment method
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$payment", count: { $sum: 1 }, revenue: { $sum: "$price" } } },
      { $sort: { count: -1 } },
    ]),

    // Revenue by month (last 6 months)
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // "YYYY-MM"
          revenue: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ]),
  ]);

  // Summary totals
  const [totalBookings, totalRevenue, totalCustomers] = await Promise.all([
    Booking.countDocuments({ status: { $ne: "cancelled" } }),
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]),
    Booking.distinct("user").then(arr => arr.length),
  ]);

  res.json({
    success: true,
    data: {
      summary: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCustomers,
        todayCount: revenueByDay.find(d => d._id === today)?.count || 0,
      },
      topServices,
      topStylists,
      revenueByDay,
      bookingsByStatus,
      bookingsByGender,
      bookingsByPayment,
      monthlyRevenue: monthlyRevenue.reverse(),
    },
  });
});

// Re-export with the new function added
module.exports = { getAllBookings, getStats, adminCancelBooking, adminEditBooking, sendNotification, getAnalytics };
