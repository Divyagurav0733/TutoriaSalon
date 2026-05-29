const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String, required: true },
    email:        { type: String, required: true },
    phone:        { type: String, required: true },
    age:          { type: Number, required: true },
    gender:       { type: String, enum: ["male", "female", "other"], required: true },

    // Service details (stored inline so records survive service list changes)
    serviceId:   { type: String, required: true },
    serviceName: { type: String, required: true },
    duration:    { type: Number, required: true }, // minutes
    price:       { type: Number, required: true },

    stylist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stylist",
      required: true,
    },

    date:     { type: String, required: true }, // "YYYY-MM-DD"
    timeSlot: { type: String, required: true }, // "HH:MM"

    payment: {
      type: String,
      enum: ["UPI", "Cash", "Card", "NetBanking"],
      default: "UPI",
    },

    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },

    // Admin notes when editing/cancelling
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-set to completed if date is in the past
bookingSchema.methods.updateStatus = function () {
  const now = new Date();
  const bookingDate = new Date(this.date + "T" + this.timeSlot + ":00");
  if (bookingDate < now && this.status === "upcoming") {
    this.status = "completed";
  }
};

module.exports = mongoose.model("Booking", bookingSchema);
