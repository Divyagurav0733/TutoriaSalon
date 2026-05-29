const asyncHandler = require("express-async-handler");
const Stylist  = require("../models/Stylist");
const Booking = require("../models/Booking");
const { sendBookingConfirmation, sendCancellationEmail } = require("../utils/sendEmail");

//Helper: break time based on duration 
const getBreakMins = (durationMins) => {
  if (durationMins >= 120) return 15;
  if (durationMins > 60)   return 10;
  return 5;
};

// generate time slots 
const generateSlots = async (stylistId, date, durationMins) => {
  const stylist = await Stylist.findById(stylistId);
  if (!stylist) return [];

  const d = new Date(date + "T00:00:00");
  const dayOfWeek = d.getDay();
  if (!stylist.days.includes(dayOfWeek)) return [];

  const existingBookings = await Booking.find({
    stylist: stylistId,
    date,
    status: { $ne: "cancelled" },
  });

  const breakMins = getBreakMins(durationMins);
  const stepH = (durationMins + breakMins) / 60;
  const durH  = durationMins / 60;
  const slots = [];

  for (let h = stylist.workStart; h + durH <= stylist.workEnd; h += stepH) {
    h = Math.round(h * 100) / 100;

    const hh    = Math.floor(h);
    const mm    = Math.round((h % 1) * 60);
    const label = `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
    const endH  = h + durH;

    const endHH  = Math.floor(endH);
    const endMM  = Math.round((endH % 1) * 60);
    const endLabel = `${String(endHH).padStart(2,"0")}:${String(endMM).padStart(2,"0")}`;

    const booked = existingBookings.some((b) => {
      const [bH, bM] = b.timeSlot.split(":").map(Number);
      const bStart = bH + bM / 60;
      const bBreak = getBreakMins(b.duration) / 60;
      const bEnd   = bStart + b.duration / 60 + bBreak;
      return h < bEnd && endH > bStart;
    });

    slots.push({ time: label, endTime: endLabel, free: !booked, duration: durationMins, breakMins });
  }

  return slots;
};

// @desc    Get available slots
// @route   GET /api/bookings/slots?stylistId=&date=&duration=
// @access  Public
const getSlots = asyncHandler(async (req, res) => {
  const { stylistId, date, duration } = req.query;
  if (!stylistId || !date || !duration) {
    res.status(400);
    throw new Error("stylistId, date and duration are required");
  }
  const slots = await generateSlots(stylistId, date, parseInt(duration));
  res.json({ success: true, data: slots });
});

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    customerName, email, phone, age, gender,
    serviceId, serviceName, duration, price,
    stylistId, date, timeSlot, payment,
  } = req.body;

  if (!customerName || !email || !phone || !age || !gender ||
      !serviceId || !serviceName || !duration || !price ||
      !stylistId || !date || !timeSlot) {
    res.status(400);
    throw new Error("All booking fields are required");
  }

  const slots = await generateSlots(stylistId, date, duration);
  const slot  = slots.find((s) => s.time === timeSlot);

  if (!slot) { res.status(400); throw new Error("Invalid time slot"); }
  if (!slot.free) { res.status(409); throw new Error("This time slot has just been booked. Please choose another."); }

  const booking = await Booking.create({
    user: req.user._id,
    customerName, email, phone, age: parseInt(age), gender,
    serviceId, serviceName, duration: parseInt(duration), price: parseInt(price),
    stylist: stylistId, date, timeSlot, payment: payment || "UPI",
  });

  await booking.populate("stylist", "name");

  // Send confirmation email to customer
  sendBookingConfirmation({
    to: email,
    customerName,
    bookingId: booking._id.toString().slice(-8).toUpperCase(),
    serviceName,
    stylistName: booking.stylist?.name || "Your Stylist",
    date, timeSlot, price, payment,
  }).catch((err) => console.log("Confirmation email error (non-critical):", err.message));

  res.status(201).json({ success: true, data: booking });
});

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("stylist", "name photo")
    .sort({ date: -1, timeSlot: -1 });

  const now = new Date();
  const updated = await Promise.all(
    bookings.map(async (b) => {
      const bookingDT = new Date(`${b.date}T${b.timeSlot}:00`);
      if (bookingDT < now && b.status === "upcoming") {
        b.status = "completed";
        await b.save();
      }
      return b;
    })
  );

  res.json({ success: true, data: updated });
});

// @desc    Cancel a booking (user — must be 24h before)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body; // optional reason from user
  const booking = await Booking.findById(req.params.id).populate("stylist", "name");

  if (!booking) { res.status(404); throw new Error("Booking not found"); }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorised to cancel this booking");
  }

  if (booking.status !== "upcoming") {
    res.status(400);
    throw new Error("Only upcoming bookings can be cancelled");
  }

  const bookingDT = new Date(`${booking.date}T${booking.timeSlot}:00`);
  const hoursLeft = (bookingDT - Date.now()) / 3600000;

  if (hoursLeft < 24) {
    res.status(400);
    throw new Error("Cancellation is only allowed 24+ hours before the appointment. Please call +91 98765 43210.");
  }

  booking.status = "cancelled";
  if (reason) booking.adminNote = `Cancelled by customer: ${reason}`;
  await booking.save();

  // ── Send cancellation email to customer ───────────────────────────────────
  sendCancellationEmail({
    to:           booking.email,
    customerName: booking.customerName,
    bookingId:    booking._id.toString().slice(-8).toUpperCase(),
    serviceName:  booking.serviceName,
    stylistName:  booking.stylist?.name || "Your Stylist",
    date:         booking.date,
    timeSlot:     booking.timeSlot,
    cancelledBy:  "customer",
    message:      reason
      ? `You cancelled this appointment with reason: "${reason}". If you'd like to rebook, please visit our website.`
      : "You have successfully cancelled your appointment. We hope to see you again soon!",
  }).catch((err) => console.log("Cancellation email error (non-critical):", err.message));

  res.json({ success: true, message: "Booking cancelled successfully", data: booking });
});

module.exports = { getSlots, createBooking, getMyBookings, cancelBooking };
