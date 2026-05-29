const mongoose = require("mongoose");

const stylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80",
    },
    gender: {
      type: String,
      enum: ["female", "male"],
      default: "female",
    },
    // Days available: 0=Sun, 1=Mon, ... 6=Sat
    days: {
      type: [Number],
      required: true,
      default: [1, 2, 3, 4, 5],
    },
    workStart: {
      type: Number,
      default: 9,
    },
    workEnd: {
      type: Number,
      default: 18,
    },
    specialization: {
      type: String,
      default: "Hair & Beauty",
    },
    bio: {
      type: String,
      default: "",
    },
    experience: {
      type: Number,
      default: 1,
    },
    // Service IDs this stylist handles (matches SERVICES constants)
    expertise: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    clientsServed: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stylist", stylistSchema);
