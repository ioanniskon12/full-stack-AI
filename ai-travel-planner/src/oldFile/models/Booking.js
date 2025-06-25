// /src/models/Booking.js - Enhanced with all new features
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  // User Information
  email: { type: String, required: true },

  // Basic Trip Information
  destination: { type: String, required: true },
  month: { type: String },
  reason: { type: String },
  duration: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },

  // Flight Information
  flight: {
    outbound: { type: String },
    return: { type: String },
  },

  // Accommodation
  hotel: { type: String },
  hotelImage: { type: String },

  // Activities
  activities: { type: [String] },
  selectedActivities: [
    {
      name: { type: String },
      price: { type: Number },
      childFriendly: { type: Boolean, default: false },
    },
  ],
  availableActivities: [
    {
      name: { type: String },
      price: { type: Number },
      childFriendly: { type: Boolean, default: false },
    },
  ],

  // Pricing
  price: { type: String, required: true },
  basePrice: { type: Number },
  totalPrice: { type: Number },

  // Passenger Information
  passengers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
  },

  // Baggage Information
  bags: {
    cabin: { type: Number, default: 0 },
    checked: { type: Number, default: 0 },
  },

  // Weather Information
  weather: {
    forecast: [
      {
        date: { type: String },
        temp: { type: String },
        condition: { type: String },
        icon: { type: String },
        humidity: { type: String },
      },
    ],
    averageTemp: { type: String },
    bestConditions: { type: String },
    clothingAdvice: { type: String },
  },

  // Child-Friendly Features (for family trips)
  childFriendlyFeatures: { type: [String] },
  isChildFriendly: {
    type: Boolean,
    default: function () {
      return (
        this.passengers &&
        (this.passengers.children > 0 || this.passengers.infants > 0)
      );
    },
  },

  // Images
  destinationImage: { type: String },

  // Search Information (preserved from original search)
  originalSearchQuery: { type: String },
  searchData: {
    query: { type: String },
    passengers: {
      adults: { type: Number },
      children: { type: Number },
      infants: { type: Number },
    },
    bags: {
      cabin: { type: Number },
      checked: { type: Number },
    },
    timestamp: { type: Date },
  },

  // Refinement History
  refinementHistory: [
    {
      refinementPrompt: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  // Booking Status
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "confirmed",
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  stripeSessionId: { type: String },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field on save
BookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total passengers
BookingSchema.virtual("totalPassengers").get(function () {
  if (!this.passengers) return 1;
  return (
    (this.passengers.adults || 0) +
    (this.passengers.children || 0) +
    (this.passengers.infants || 0)
  );
});

// Virtual for total children
BookingSchema.virtual("totalChildren").get(function () {
  if (!this.passengers) return 0;
  return (this.passengers.children || 0) + (this.passengers.infants || 0);
});

// Virtual for formatted date range
BookingSchema.virtual("dateRange").get(function () {
  if (!this.startDate || !this.endDate) return "";

  const start = this.startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const end = this.endDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return `${start} - ${end}`;
});

// Instance method to check if trip is family-friendly
BookingSchema.methods.isFamilyTrip = function () {
  return (
    this.passengers &&
    (this.passengers.children > 0 || this.passengers.infants > 0)
  );
};

// Instance method to get child-friendly activities
BookingSchema.methods.getChildFriendlyActivities = function () {
  if (!this.availableActivities) return [];
  return this.availableActivities.filter((activity) => activity.childFriendly);
};

// Instance method to calculate activities total
BookingSchema.methods.getActivitiesTotal = function () {
  if (!this.selectedActivities) return 0;
  return this.selectedActivities.reduce(
    (total, activity) => total + (activity.price || 0),
    0
  );
};

// Static method to find family bookings
BookingSchema.statics.findFamilyBookings = function () {
  return this.find({
    $or: [
      { "passengers.children": { $gt: 0 } },
      { "passengers.infants": { $gt: 0 } },
    ],
  });
};

// Static method to find bookings by destination
BookingSchema.statics.findByDestination = function (destination) {
  return this.find({
    destination: new RegExp(destination, "i"),
  });
};

// Index for faster queries
BookingSchema.index({ email: 1, createdAt: -1 });
BookingSchema.index({ destination: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ "passengers.children": 1, "passengers.infants": 1 });

// Avoid model overwrite upon hot reload
export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
