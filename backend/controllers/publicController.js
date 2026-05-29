const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Stylist = require("../models/Stylist");

// @desc  Public charts — no auth, no revenue, no financial data
// @route GET /api/public/charts
// @access Public (everyone, signed in or not)
const getPublicCharts = asyncHandler(async (req, res) => {

  const [topServices, topStylists, bookingsByGender, monthlyTrend] = await Promise.all([

    // Most booked services — count only, NO revenue
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$serviceName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),

    // Most booked stylists — name + count only, NO revenue
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$stylist", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "stylists",
          localField: "_id",
          foreignField: "_id",
          as: "info",
        },
      },
      { $unwind: "$info" },
      { $project: { _id: 0, name: "$info.name", specialization: "$info.specialization", count: 1 } },
    ]),

    // Bookings split by gender — count only
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]),

    // Monthly booking trend — count only, NO revenue
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // "YYYY-MM"
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      topServices,
      topStylists,
      bookingsByGender,
      monthlyTrend: monthlyTrend.reverse(),
    },
  });
});

module.exports = { getPublicCharts };
