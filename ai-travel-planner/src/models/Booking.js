// src/models/Booking.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
  },
  duration: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  flight: {
    outbound: String,
    return: String,
  },
  hotel: {
    type: String,
    required: true,
  },
  activities: [
    {
      name: String,
      price: Number,
      childFriendly: Boolean,
    },
  ],
  price: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  passengers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
  },
  weather: {
    forecast: [
      {
        date: String,
        temp: String,
        condition: String,
        icon: String,
      },
    ],
    averageTemp: String,
    bestConditions: String,
    clothingAdvice: String,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded", "test_mode"],
    default: "pending",
  },
  stripeSessionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp on save
BookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
