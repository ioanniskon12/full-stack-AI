// src/models/Booking.js - Complete Comprehensive Model for All Phases
import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema(
  {
    airline: {
      type: String,
      trim: true,
    },
    flightNumber: {
      type: String,
      trim: true,
    },
    departure: {
      airport: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      date: {
        type: Date,
      },
      time: {
        type: String,
        trim: true,
      },
    },
    arrival: {
      airport: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      date: {
        type: Date,
      },
      time: {
        type: String,
        trim: true,
      },
    },
    duration: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      enum: ["economy", "premium-economy", "business", "first"],
      default: "economy",
    },
    price: {
      type: Number,
      min: 0,
    },
    bookingReference: {
      type: String,
      trim: true,
    },
    seatNumber: {
      type: String,
      trim: true,
    },
    baggage: {
      carry: {
        type: String,
        trim: true,
      },
      checked: {
        type: String,
        trim: true,
      },
    },
  },
  { _id: false }
);

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      coordinates: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    roomType: {
      type: String,
      trim: true,
    },
    guests: {
      adults: {
        type: Number,
        min: 1,
        default: 1,
      },
      children: {
        type: Number,
        min: 0,
        default: 0,
      },
      rooms: {
        type: Number,
        min: 1,
        default: 1,
      },
    },
    amenities: [String],
    familyFriendly: {
      type: Boolean,
      default: false,
    },
    price: {
      perNight: {
        type: Number,
        min: 0,
      },
      total: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      taxes: {
        type: Number,
        min: 0,
        default: 0,
      },
      fees: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    cancellationPolicy: {
      type: String,
      trim: true,
    },
    bookingReference: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String],
  },
  { _id: false }
);

const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Activity name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      "sightseeing",
      "adventure",
      "cultural",
      "food",
      "entertainment",
      "sports",
      "nature",
      "shopping",
      "relaxation",
      "educational",
      "family",
      "other",
    ],
    default: "sightseeing",
  },
  duration: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
    trim: true,
  },
  location: {
    name: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
  },
  price: {
    adult: {
      type: Number,
      min: 0,
      default: 0,
    },
    child: {
      type: Number,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
  },
  participants: {
    adults: {
      type: Number,
      min: 0,
      default: 1,
    },
    children: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  childFriendly: {
    type: Boolean,
    default: false,
  },
  difficultyLevel: {
    type: String,
    enum: ["easy", "moderate", "difficult", "extreme"],
    default: "easy",
  },
  provider: {
    name: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
  },
  bookingReference: {
    type: String,
    trim: true,
  },
  cancellationPolicy: {
    type: String,
    trim: true,
  },
  requirements: [String],
  included: [String],
  excluded: [String],
  images: [String],
  reviews: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    count: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

const WeatherForecastSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    condition: {
      type: String,
      trim: true,
    },
    temperature: {
      high: {
        type: Number,
      },
      low: {
        type: Number,
      },
      unit: {
        type: String,
        enum: ["celsius", "fahrenheit"],
        default: "celsius",
      },
    },
    humidity: {
      type: Number,
      min: 0,
      max: 100,
    },
    windSpeed: {
      type: Number,
      min: 0,
    },
    precipitation: {
      probability: {
        type: Number,
        min: 0,
        max: 100,
      },
      amount: {
        type: Number,
        min: 0,
      },
    },
    icon: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    clothingAdvice: [String],
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    // User Information
    userId: {
      type: String, // Can be ObjectId or email for flexibility
      required: [true, "User ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please enter a valid email address",
      },
    },

    // Trip Basic Information - PHASE 1
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    month: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    // Travel Details - PHASE 2
    flight: {
      outbound: {
        type: FlightSchema,
        default: null,
      },
      return: {
        type: FlightSchema,
        default: null,
      },
    },
    hotel: {
      type: HotelSchema,
      default: null,
    },
    activities: [String], // Simple list for Phase 1
    selectedActivities: [ActivitySchema], // Detailed for Phase 2+

    // Weather Information - PHASE 3
    weather: [WeatherForecastSchema],
    clothingAdvice: [String],

    // Family-Friendly Features - ALL PHASES
    hasChildren: {
      type: Boolean,
      default: false,
    },
    childFriendlyFeatures: [String],
    childrenAges: [
      {
        type: Number,
        min: 0,
        max: 18,
      },
    ],

    // Pricing Information - PHASE 1
    price: {
      type: String, // Display format like "$2,500"
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    priceBreakdown: {
      basePrice: {
        type: Number,
        min: 0,
      },
      flights: {
        type: Number,
        min: 0,
        default: 0,
      },
      hotel: {
        type: Number,
        min: 0,
        default: 0,
      },
      activities: {
        type: Number,
        min: 0,
        default: 0,
      },
      taxes: {
        type: Number,
        min: 0,
        default: 0,
      },
      fees: {
        type: Number,
        min: 0,
        default: 0,
      },
      discounts: {
        type: Number,
        min: 0,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },

    // Passenger Information - PHASE 1
    passengers: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },

    // Payment Information - STRIPE ONLY
    paymentMethod: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    stripeCustomerId: String,
    paymentUrl: String,

    // Booking Status
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "cancelled", "completed"],
      default: "pending_payment",
    },

    // Booking References
    bookingReference: {
      type: String,
      unique: true,
      trim: true,
    },
    confirmationNumber: {
      type: String,
      trim: true,
    },

    // Traveler Information - PHASE 3
    travelers: [
      {
        type: {
          type: String,
          enum: ["adult", "child", "infant"],
          required: true,
        },
        firstName: {
          type: String,
          trim: true,
        },
        lastName: {
          type: String,
          trim: true,
        },
        dateOfBirth: {
          type: Date,
        },
        passportNumber: {
          type: String,
          trim: true,
        },
        passportExpiry: {
          type: Date,
        },
        nationality: {
          type: String,
          trim: true,
        },
        specialRequests: {
          type: String,
          trim: true,
        },
      },
    ],

    // Additional Information
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    internalNotes: {
      type: String,
      trim: true,
    },

    // Cancellation Information - PHASE 3
    cancellation: {
      isCancelled: {
        type: Boolean,
        default: false,
      },
      cancelledAt: {
        type: Date,
      },
      cancelledBy: {
        type: String,
      },
      reason: {
        type: String,
        trim: true,
      },
      refundAmount: {
        type: Number,
        min: 0,
      },
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "failed"],
      },
    },

    // Modification History - PHASE 3
    modifications: [
      {
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
        modifiedBy: {
          type: String,
        },
        field: {
          type: String,
          required: true,
        },
        oldValue: {
          type: mongoose.Schema.Types.Mixed,
        },
        newValue: {
          type: mongoose.Schema.Types.Mixed,
        },
        reason: {
          type: String,
          trim: true,
        },
      },
    ],

    // Review and Rating - PHASE 3
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [1000, "Review comment cannot exceed 1000 characters"],
      },
      reviewedAt: {
        type: Date,
      },
      helpful: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    // Metadata
    source: {
      type: String,
      enum: ["web", "mobile", "api", "admin"],
      default: "web",
    },
    destinationImage: String,
    originalSearchQuery: String,
    refinementHistory: [String],
    searchData: Object,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    paidAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for performance
BookingSchema.index({ userId: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ destination: 1 });
BookingSchema.index({ startDate: 1 });
BookingSchema.index({ endDate: 1 });
BookingSchema.index({ bookingReference: 1 }, { unique: true, sparse: true });
BookingSchema.index({ stripeSessionId: 1 });
BookingSchema.index({ createdAt: -1 });

// Compound indexes
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ email: 1, status: 1 });
BookingSchema.index({ destination: 1, startDate: 1 });

// Virtual fields
BookingSchema.virtual("totalDays").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

BookingSchema.virtual("totalPassengers").get(function () {
  return (
    this.passengers.adults + this.passengers.children + this.passengers.infants
  );
});

BookingSchema.virtual("isFamilyTrip").get(function () {
  return this.passengers.children > 0 || this.passengers.infants > 0;
});

BookingSchema.virtual("isUpcoming").get(function () {
  return this.startDate > new Date();
});

BookingSchema.virtual("isPast").get(function () {
  return this.endDate < new Date();
});

BookingSchema.virtual("canCancel").get(function () {
  return (
    this.status === "confirmed" &&
    this.isUpcoming &&
    !this.cancellation?.isCancelled
  );
});

BookingSchema.virtual("daysUntilTrip").get(function () {
  if (!this.isUpcoming) return 0;
  const diffTime = this.startDate - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware
BookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  // Generate booking reference if not exists
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.bookingReference = `AT-${timestamp}-${random}`.toUpperCase();
  }

  // Calculate total price if not set
  if (!this.totalPrice && this.priceBreakdown) {
    const breakdown = this.priceBreakdown;
    this.totalPrice =
      (breakdown.basePrice || 0) +
      (breakdown.flights || 0) +
      (breakdown.hotel || 0) +
      (breakdown.activities || 0) +
      (breakdown.taxes || 0) +
      (breakdown.fees || 0) -
      (breakdown.discounts || 0);
  }

  // Set family flags
  this.hasChildren =
    this.passengers.children > 0 || this.passengers.infants > 0;

  next();
});

// Instance methods
BookingSchema.methods.markAsPaid = function (paymentIntentId) {
  this.paymentStatus = "paid";
  this.status = "confirmed";
  this.stripePaymentIntentId = paymentIntentId;
  this.paidAt = new Date();
  return this.save();
};

BookingSchema.methods.markAsFailed = function () {
  this.paymentStatus = "failed";
  this.status = "pending_payment";
  return this.save();
};

BookingSchema.methods.cancel = function (reason, cancelledBy) {
  this.cancellation = {
    isCancelled: true,
    cancelledAt: new Date(),
    reason: reason,
    cancelledBy: cancelledBy,
  };
  this.status = "cancelled";
  return this.save();
};

BookingSchema.methods.addReview = function (rating, comment) {
  this.review = {
    rating: rating,
    comment: comment,
    reviewedAt: new Date(),
  };
  return this.save();
};

// Static methods
BookingSchema.statics.findByEmail = function (email) {
  return this.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
};

BookingSchema.statics.findByUserId = function (userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

BookingSchema.statics.findUpcoming = function (userId = null) {
  const query = {
    startDate: { $gt: new Date() },
    status: { $in: ["confirmed", "pending_payment"] },
    "cancellation.isCancelled": { $ne: true },
  };
  if (userId) query.userId = userId;
  return this.find(query).sort({ startDate: 1 });
};

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
