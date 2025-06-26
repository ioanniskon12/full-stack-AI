// models/Booking.js - Standardized Booking model
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
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
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
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
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
    images: [
      {
        type: String,
        trim: true,
      },
    ],
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
  requirements: [
    {
      type: String,
      trim: true,
    },
  ],
  included: [
    {
      type: String,
      trim: true,
    },
  ],
  excluded: [
    {
      type: String,
      trim: true,
    },
  ],
  images: [
    {
      type: String,
      trim: true,
    },
  ],
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
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    // User Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    // Trip Basic Information
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    // Travel Details
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
      required: [true, "Hotel information is required"],
    },
    activities: [ActivitySchema],
    selectedActivities: [ActivitySchema],

    // Weather Information
    weather: [WeatherForecastSchema],
    clothingAdvice: [
      {
        type: String,
        trim: true,
      },
    ],

    // Family-Friendly Features
    hasChildren: {
      type: Boolean,
      default: false,
    },
    childFriendlyFeatures: [
      {
        type: String,
        trim: true,
      },
    ],
    childrenAges: [
      {
        type: Number,
        min: 0,
        max: 18,
      },
    ],

    // Pricing Information
    price: {
      type: String,
      required: [true, "Price is required"],
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

    // Booking Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "test_mode"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "stripe", "test"],
      default: null,
    },
    paymentReference: {
      type: String,
      trim: true,
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

    // Additional Information
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    internalNotes: {
      type: String,
      trim: true,
      maxlength: [2000, "Internal notes cannot exceed 2000 characters"],
    },

    // Traveler Information
    travelers: [
      {
        type: {
          type: String,
          enum: ["adult", "child", "infant"],
          required: true,
        },
        firstName: {
          type: String,
          required: true,
          trim: true,
        },
        lastName: {
          type: String,
          required: true,
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

    // Cancellation Information
    cancellation: {
      isCancelled: {
        type: Boolean,
        default: false,
      },
      cancelledAt: {
        type: Date,
      },
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
        default: null,
      },
    },

    // Modification History
    modifications: [
      {
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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

    // Review and Rating
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
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    sessionId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Remove sensitive fields from JSON output
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for better query performance
BookingSchema.index({ userId: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ destination: 1 });
BookingSchema.index({ startDate: 1 });
BookingSchema.index({ endDate: 1 });
BookingSchema.index({ bookingReference: 1 }, { unique: true, sparse: true });
BookingSchema.index({ createdAt: -1 });

// Compound indexes
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ email: 1, status: 1 });
BookingSchema.index({ destination: 1, startDate: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });

// Virtual fields
BookingSchema.virtual("totalDays").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

BookingSchema.virtual("isUpcoming").get(function () {
  return this.startDate > new Date();
});

BookingSchema.virtual("isPast").get(function () {
  return this.endDate < new Date();
});

BookingSchema.virtual("isActive").get(function () {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

BookingSchema.virtual("canCancel").get(function () {
  return (
    this.status === "confirmed" &&
    this.isUpcoming &&
    !this.cancellation.isCancelled
  );
});

BookingSchema.virtual("canModify").get(function () {
  return (
    this.status === "confirmed" &&
    this.isUpcoming &&
    !this.cancellation.isCancelled
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

  // Validate date range
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    return next(new Error("End date must be after start date"));
  }

  // Validate hotel check-in/out dates match trip dates
  if (this.hotel && this.hotel.checkIn && this.hotel.checkOut) {
    if (
      this.hotel.checkIn < this.startDate ||
      this.hotel.checkOut > this.endDate
    ) {
      return next(new Error("Hotel dates must be within trip dates"));
    }
  }

  next();
});

// Post-save middleware
BookingSchema.post("save", async function (doc) {
  // Update user stats when booking is created
  if (this.isNew) {
    try {
      const User = mongoose.model("User");
      await User.findByIdAndUpdate(doc.userId, {
        $inc: {
          "stats.totalBookings": 1,
          "stats.totalSpent": doc.totalPrice || 0,
        },
        $addToSet: { "stats.countriesVisited": doc.destination },
      });
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  }
});

// Static methods
BookingSchema.statics.findByUser = function (userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

BookingSchema.statics.findByEmail = function (email) {
  return this.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
};

BookingSchema.statics.findUpcoming = function (userId = null) {
  const query = {
    startDate: { $gt: new Date() },
    status: { $in: ["confirmed", "pending"] },
    "cancellation.isCancelled": { $ne: true },
  };

  if (userId) {
    query.userId = userId;
  }

  return this.find(query).sort({ startDate: 1 });
};

BookingSchema.statics.findPast = function (userId = null) {
  const query = {
    endDate: { $lt: new Date() },
    status: { $in: ["confirmed", "completed"] },
  };

  if (userId) {
    query.userId = userId;
  }

  return this.find(query).sort({ endDate: -1 });
};

BookingSchema.statics.findByDestination = function (destination) {
  return this.find({
    destination: new RegExp(destination, "i"),
    status: { $in: ["confirmed", "completed"] },
  }).sort({ createdAt: -1 });
};

BookingSchema.statics.getBookingStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        totalRevenue: { $sum: "$totalPrice" },
        averageBookingValue: { $avg: "$totalPrice" },
        topDestinations: { $push: "$destination" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      averageBookingValue: 0,
      topDestinations: [],
    }
  );
};

// Instance methods
BookingSchema.methods.cancel = function (reason, cancelledBy) {
  this.cancellation.isCancelled = true;
  this.cancellation.cancelledAt = new Date();
  this.cancellation.reason = reason;
  this.cancellation.cancelledBy = cancelledBy;
  this.status = "cancelled";

  return this.save();
};

BookingSchema.methods.confirm = function () {
  this.status = "confirmed";
  this.paymentStatus = "paid";

  return this.save();
};

BookingSchema.methods.complete = function () {
  this.status = "completed";

  return this.save();
};

BookingSchema.methods.addReview = function (rating, comment) {
  this.review.rating = rating;
  this.review.comment = comment;
  this.review.reviewedAt = new Date();

  return this.save();
};

BookingSchema.methods.addModification = function (
  field,
  oldValue,
  newValue,
  reason,
  modifiedBy
) {
  this.modifications.push({
    field,
    oldValue,
    newValue,
    reason,
    modifiedBy,
    modifiedAt: new Date(),
  });

  return this.save();
};

BookingSchema.methods.calculateRefund = function () {
  if (!this.canCancel) return 0;

  const daysUntilTrip = this.daysUntilTrip;
  let refundPercentage = 0;

  // Refund policy based on days until trip
  if (daysUntilTrip >= 30) {
    refundPercentage = 0.9; // 90% refund
  } else if (daysUntilTrip >= 14) {
    refundPercentage = 0.75; // 75% refund
  } else if (daysUntilTrip >= 7) {
    refundPercentage = 0.5; // 50% refund
  } else if (daysUntilTrip >= 3) {
    refundPercentage = 0.25; // 25% refund
  } else {
    refundPercentage = 0; // No refund
  }

  return Math.round(this.totalPrice * refundPercentage);
};

BookingSchema.methods.isOwnedBy = function (userId) {
  return this.userId.toString() === userId.toString();
};

BookingSchema.methods.hasEmail = function (email) {
  return this.email.toLowerCase() === email.toLowerCase();
};

// Error handling
BookingSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    next(new Error(message));
  } else {
    next(error);
  }
});

// Create model only if it doesn't exist (prevents re-compilation errors)
export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
