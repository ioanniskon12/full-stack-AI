// // models/Booking.js - Enhanced with weather, family features, and images
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    tripId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "refunded"],
      default: "pending",
    },

    // Enhanced Trip Information
    destination: {
      type: String,
      required: true,
    },
    destinationImage: String,
    destinationImageAlt: String, // For accessibility
    month: String,
    reason: String,
    duration: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    // Enhanced Traveler Information (renamed from travelers)
    passengers: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },

    // Baggage Information
    baggage: {
      cabin: { type: Number, default: 0 },
      checked: { type: Number, default: 0 },
    },

    // Search Context (preserved from original search)
    originalSearchQuery: String,
    searchData: {
      query: String,
      passengers: {
        adults: Number,
        children: Number,
        infants: Number,
      },
      baggage: {
        cabin: Number,
        checked: Number,
      },
      searchTimestamp: Date,
    },

    // Weather Information
    weather: {
      forecast: [
        {
          date: String,
          temp: String,
          condition: String,
          icon: String,
          humidity: String,
        },
      ],
      averageTemp: String,
      bestConditions: String,
      clothingAdvice: String,
      lastUpdated: { type: Date, default: Date.now },
    },

    // Enhanced Flight Information
    flight: {
      outbound: {
        airline: String,
        flightNumber: String,
        departure: String,
        arrival: String,
        departureTime: Date,
        arrivalTime: Date,
        duration: String,
        class: { type: String, default: "Economy" },
        gate: String,
        terminal: String,
        seatPreference: String,
        airportCodes: {
          departure: String,
          arrival: String,
        },
      },
      return: {
        airline: String,
        flightNumber: String,
        departure: String,
        arrival: String,
        departureTime: Date,
        arrivalTime: Date,
        duration: String,
        class: { type: String, default: "Economy" },
        gate: String,
        terminal: String,
        seatPreference: String,
        airportCodes: {
          departure: String,
          arrival: String,
        },
      },
      price: Number,
      bookingReference: String,
      specialRequests: [String], // Meal preferences, assistance, etc.
    },

    // Enhanced Hotel Information
    hotel: {
      name: String,
      address: String,
      rating: Number,
      checkIn: Date,
      checkOut: Date,
      roomType: String,
      boardType: { type: String, default: "Room Only" },
      price: Number,
      image: String, // Hotel image URL
      amenities: [String],
      // Family-specific amenities
      familyAmenities: [
        {
          name: String,
          available: { type: Boolean, default: false },
          description: String,
        },
      ],
      specialRequests: String,
      confirmationNumber: String,
    },

    // Enhanced Activities with Images
    activities: [
      {
        name: String,
        description: String,
        image: String, // Activity image URL
        date: Date,
        duration: String,
        price: Number,
        included: { type: Boolean, default: false },
        booked: { type: Boolean, default: false },
        childFriendly: { type: Boolean, default: false },
        minAge: Number,
        maxParticipants: Number,
        meetingPoint: String,
        whatToBring: [String],
        category: {
          type: String,
          enum: [
            "adventure",
            "cultural",
            "relaxation",
            "dining",
            "shopping",
            "nightlife",
            "sports",
            "nature",
            "family",
          ],
        },
      },
    ],

    // Selected Activities (what user actually chose)
    selectedActivities: [
      {
        name: String,
        price: Number,
        childFriendly: { type: Boolean, default: false },
        selectedAt: { type: Date, default: Date.now },
      },
    ],

    // Family-Specific Features
    familyFeatures: {
      isChildFriendly: {
        type: Boolean,
        default: function () {
          return (
            this.passengers &&
            (this.passengers.children > 0 || this.passengers.infants > 0)
          );
        },
      },
      childFriendlyAmenities: [String], // Baby changing, high chairs, etc.
      specialRequests: String, // Car seats, strollers, etc.
      childrenAges: [Number], // Actual ages of children
    },

    // Enhanced Pricing
    pricing: {
      basePrice: Number,
      flightPrice: Number,
      hotelPrice: Number,
      activitiesPrice: Number,
      selectedActivitiesPrice: {
        type: Number,
        default: function () {
          return (
            this.selectedActivities?.reduce(
              (sum, activity) => sum + (activity.price || 0),
              0
            ) || 0
          );
        },
      },
      taxes: Number,
      fees: Number,
      discount: Number,
      totalPrice: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      priceBreakdown: {
        adults: Number,
        children: Number,
        infants: Number,
      },
    },

    // Enhanced Payment Information
    payment: {
      method: {
        type: String,
        enum: ["card", "paypal", "bank_transfer", "cash"],
        default: "card",
      },
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      stripeSessionId: String,
      stripePaymentIntentId: String,
      paidAt: Date,
      refundedAt: Date,
      refundAmount: Number,
      installments: {
        enabled: { type: Boolean, default: false },
        plan: String,
        nextPaymentDate: Date,
      },
    },

    // Enhanced Notes and Communication
    notes: {
      userNotes: String,
      adminNotes: String,
      specialRequests: String,
      dietaryRequirements: [String],
      accessibilityNeeds: [String],
      emergencyContacts: [
        {
          name: String,
          phone: String,
          relationship: String,
        },
      ],
    },

    // Trip Refinement History
    refinementHistory: [
      {
        refinementPrompt: String,
        changesRequested: Object,
        appliedAt: { type: Date, default: Date.now },
        previousState: Object, // Snapshot before changes
      },
    ],

    // Enhanced Modifications Tracking
    modifications: [
      {
        modifiedAt: Date,
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        modificationType: {
          type: String,
          enum: ["user_request", "admin_update", "system_update", "refinement"],
        },
        changes: Object,
        reason: String,
        approved: { type: Boolean, default: false },
      },
    ],

    // Enhanced Cancellation
    cancellation: {
      cancelledAt: Date,
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reason: String,
      refundAmount: Number,
      cancellationFee: Number,
      refundMethod: String,
      processedAt: Date,
    },

    // Documents and Attachments
    documents: [
      {
        type: {
          type: String,
          enum: [
            "ticket",
            "voucher",
            "invoice",
            "itinerary",
            "passport",
            "visa",
            "insurance",
          ],
        },
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        expiryDate: Date,
      },
    ],

    // Travel Insurance
    insurance: {
      provider: String,
      policyNumber: String,
      coverage: String,
      premium: Number,
      included: { type: Boolean, default: false },
    },

    // Reviews and Feedback
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      reviewedAt: Date,
      wouldRecommend: Boolean,
      categoryRatings: {
        flights: { type: Number, min: 1, max: 5 },
        hotel: { type: Number, min: 1, max: 5 },
        activities: { type: Number, min: 1, max: 5 },
        overall: { type: Number, min: 1, max: 5 },
      },
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    bookedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Enhanced Indexes
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ tripId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ destination: 1 });
BookingSchema.index({ startDate: 1, endDate: 1 });
BookingSchema.index({ "payment.status": 1 });
BookingSchema.index({ "passengers.children": 1, "passengers.infants": 1 }); // For family bookings
BookingSchema.index({ "familyFeatures.isChildFriendly": 1 });

// Enhanced Virtuals
BookingSchema.virtual("tripDuration").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

BookingSchema.virtual("totalPassengers").get(function () {
  const p = this.passengers || {};
  return (p.adults || 0) + (p.children || 0) + (p.infants || 0);
});

BookingSchema.virtual("totalChildren").get(function () {
  const p = this.passengers || {};
  return (p.children || 0) + (p.infants || 0);
});

BookingSchema.virtual("isFamilyTrip").get(function () {
  return this.totalChildren > 0;
});

BookingSchema.virtual("formattedDateRange").get(function () {
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

// Enhanced Methods
BookingSchema.methods.calculateTotalPrice = function () {
  const {
    basePrice,
    flightPrice,
    hotelPrice,
    activitiesPrice,
    selectedActivitiesPrice,
    taxes,
    fees,
    discount,
  } = this.pricing;

  const subtotal =
    (basePrice || 0) +
    (flightPrice || 0) +
    (hotelPrice || 0) +
    (activitiesPrice || 0) +
    (selectedActivitiesPrice || 0);

  const total = subtotal + (taxes || 0) + (fees || 0) - (discount || 0);
  return Math.max(0, total);
};

BookingSchema.methods.addRefinement = function (
  refinementPrompt,
  changesRequested
) {
  this.refinementHistory.push({
    refinementPrompt,
    changesRequested,
    previousState: this.toObject(),
  });
  return this.save();
};

BookingSchema.methods.getChildFriendlyActivities = function () {
  return this.activities.filter((activity) => activity.childFriendly);
};

BookingSchema.methods.updateWeather = function (weatherData) {
  this.weather = {
    ...weatherData,
    lastUpdated: new Date(),
  };
  return this.save();
};

// Static Methods
BookingSchema.statics.findFamilyBookings = function () {
  return this.find({
    $or: [
      { "passengers.children": { $gt: 0 } },
      { "passengers.infants": { $gt: 0 } },
      { "familyFeatures.isChildFriendly": true },
    ],
  });
};

BookingSchema.statics.findByDestination = function (destination) {
  return this.find({
    destination: new RegExp(destination, "i"),
  }).sort({ createdAt: -1 });
};

BookingSchema.statics.getBookingStats = function (userId) {
  return this.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalSpent: { $sum: "$pricing.totalPrice" },
        avgTripDuration: { $avg: "$tripDuration" },
        favoriteDestinations: { $push: "$destination" },
      },
    },
  ]);
};

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);

// new done
