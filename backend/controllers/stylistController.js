const asyncHandler = require("express-async-handler");
const Stylist = require("../models/Stylist");

// @desc    Get all active stylists
// @route   GET /api/stylists
// @access  Public
const getStylists = asyncHandler(async (req, res) => {
  const stylists = await Stylist.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, data: stylists });
});

// @desc    Get single stylist
// @route   GET /api/stylists/:id
// @access  Public
const getStylist = asyncHandler(async (req, res) => {
  const stylist = await Stylist.findById(req.params.id);
  if (!stylist) {
    res.status(404);
    throw new Error("Stylist not found");
  }
  res.json({ success: true, data: stylist });
});

// @desc    Create a stylist (Admin)
// @route   POST /api/stylists
// @access  Admin
const createStylist = asyncHandler(async (req, res) => {
  const { name, photo, gender, days, workStart, workEnd, specialization, bio, experience, expertise, rating } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }

  const stylist = await Stylist.create({
    name,
    photo: photo || "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80",
    gender,
    days,
    workStart,
    workEnd,
    specialization,
    bio,
    experience,
    expertise,
    rating,
  });

  res.status(201).json({ success: true, data: stylist });
});

// @desc    Update a stylist (Admin)
// @route   PUT /api/stylists/:id
// @access  Admin
const updateStylist = asyncHandler(async (req, res) => {
  const stylist = await Stylist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!stylist) {
    res.status(404);
    throw new Error("Stylist not found");
  }

  res.json({ success: true, data: stylist });
});

// @desc    Deactivate a stylist (Admin) — soft delete
// @route   DELETE /api/stylists/:id
// @access  Admin
const deleteStylist = asyncHandler(async (req, res) => {
  const stylist = await Stylist.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!stylist) {
    res.status(404);
    throw new Error("Stylist not found");
  }

  res.json({ success: true, message: "Stylist deactivated", data: stylist });
});

module.exports = { getStylists, getStylist, createStylist, updateStylist, deleteStylist };
