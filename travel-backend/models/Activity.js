// models/Activity.js - Enhanced with family features and images
import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
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
        "family", // Added family category
        "educational",
        "entertainment",
      ],
      required: true,
    },
    description: String,
    duration: String,

    // Enhanced Pricing
    price: {
      adult: Number,
      child: Number,
      infant: Number,
      family: Number, // Family package price
      currency: { type: String, default: "USD" },
    },

    // Family-Friendly Features
    childFriendly: {
      type: Boolean,
      default: false,
    },
    ageRestrictions: {
      minAge: { type: Number, default: 0 },
      maxAge: Number,
      adultSupervisionRequired: { type: Boolean, default: false },
    },
    familyFeatures: {
      babyChangingFacilities: { type: Boolean, default: false },
      highChairsAvailable: { type: Boolean, default: false },
      strollerFriendly: { type: Boolean, default: false },
      kidsMenu: { type: Boolean, default: false },
      playArea: { type: Boolean, default: false },
    },

    // Enhanced Content
    included: [String],
    excluded: [String],
    whatToBring: [String],
    importantNotes: [String],

    // Scheduling
    availability: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: true },
      sunday: { type: Boolean, default: true },
    },
    timeSlots: [
      {
        startTime: String,
        endTime: String,
        maxCapacity: Number,
      },
    ],

    // Capacity
    minParticipants: { type: Number, default: 1 },
    maxParticipants: Number,
    maxChildren: Number,

    // Enhanced Rating System
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      familyRating: { type: Number, default: 0 }, // Specific family rating
      familyReviewCount: { type: Number, default: 0 },
    },

    // Enhanced Images
    images: [
      {
        url: String,
        alt: String,
        caption: String,
        isCover: { type: Boolean, default: false },
      },
    ],

    // Location Details
    meetingPoint: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    transportation: {
      provided: { type: Boolean, default: false },
      pickupLocations: [String],
      instructions: String,
    },

    // Weather Considerations
    weatherDependent: { type: Boolean, default: false },
    weatherAlternative: String,
    bestWeatherConditions: [String],

    // Accessibility
    accessibility: {
      wheelchairAccessible: { type: Boolean, default: false },
      hearingImpairedFriendly: { type: Boolean, default: false },
      visuallyImpairedFriendly: { type: Boolean, default: false },
      notes: String,
    },

    // Languages
    languages: [String],
    guideRequired: { type: Boolean, default: false },

    // Booking Information
    instantBooking: { type: Boolean, default: true },
    advanceBookingRequired: Number, // Days in advance
    cancellationPolicy: {
      freeCancellation: { type: Boolean, default: true },
      cancellationDeadline: Number, // Hours before activity
      refundPolicy: String,
    },

    // Reviews
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        booking: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        familyReview: { type: Boolean, default: false },
        travelledWith: {
          type: String,
          enum: ["solo", "couple", "family", "friends", "business"],
        },
        reviewDate: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false },
      },
    ],

    // Activity Status
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    seasonality: {
      seasonal: { type: Boolean, default: false },
      availableMonths: [String],
    },

    // SEO and Marketing
    tags: [String],
    seoDescription: String,
    popularityScore: { type: Number, default: 0 },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ActivitySchema.index({ destination: 1, category: 1 });
ActivitySchema.index({ childFriendly: 1 });
ActivitySchema.index({ "rating.average": -1 });
ActivitySchema.index({ "rating.familyRating": -1 });
ActivitySchema.index({ popularityScore: -1 });
ActivitySchema.index({ isActive: 1, isFeatured: 1 });
ActivitySchema.index({ tags: 1 });

// Virtual for cover image
ActivitySchema.virtual("coverImage").get(function () {
  const coverImg = this.images.find((img) => img.isCover);
  return coverImg || this.images[0] || null;
});

// Virtual for family suitability score
ActivitySchema.virtual("familySuitabilityScore").get(function () {
  if (!this.childFriendly) return 0;

  let score = 0;
  if (this.familyFeatures.strollerFriendly) score += 20;
  if (this.familyFeatures.babyChangingFacilities) score += 20;
  if (this.familyFeatures.kidsMenu) score += 15;
  if (this.familyFeatures.playArea) score += 25;
  if (this.ageRestrictions.minAge <= 3) score += 20;

  return score;
});

// Instance Methods
ActivitySchema.methods.addReview = function (
  userId,
  bookingId,
  rating,
  comment,
  travelledWith = "solo"
) {
  const isFamilyReview = ["family"].includes(travelledWith);

  this.reviews.push({
    user: userId,
    booking: bookingId,
    rating,
    comment,
    familyReview: isFamilyReview,
    travelledWith,
    verified: true, // Set based on booking verification
  });

  // Update ratings
  this.rating.count += 1;
  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  this.rating.average = totalRating / this.rating.count;

  if (isFamilyReview) {
    this.rating.familyReviewCount += 1;
    const familyRatings = this.reviews.filter((r) => r.familyReview);
    const familyTotal = familyRatings.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.rating.familyRating = familyTotal / this.rating.familyReviewCount;
  }

  return this.save();
};

ActivitySchema.methods.isAvailableForFamily = function (childrenAges = []) {
  if (!this.childFriendly) return false;

  const minAge = this.ageRestrictions.minAge || 0;
  const maxAge = this.ageRestrictions.maxAge;

  return childrenAges.every((age) => {
    return age >= minAge && (!maxAge || age <= maxAge);
  });
};

ActivitySchema.methods.calculateFamilyPrice = function (
  adults,
  children,
  infants
) {
  const pricing = this.price;

  if (pricing.family && adults + children >= 2) {
    return pricing.family;
  }

  const adultCost = (adults || 0) * (pricing.adult || 0);
  const childCost = (children || 0) * (pricing.child || pricing.adult || 0);
  const infantCost = (infants || 0) * (pricing.infant || 0);

  return adultCost + childCost + infantCost;
};

// Static Methods
ActivitySchema.statics.findChildFriendly = function (destination) {
  return this.find({
    destination: new RegExp(destination, "i"),
    childFriendly: true,
    isActive: true,
  }).sort({ "rating.familyRating": -1 });
};

ActivitySchema.statics.findByCategory = function (destination, category) {
  return this.find({
    destination: new RegExp(destination, "i"),
    category,
    isActive: true,
  }).sort({ "rating.average": -1 });
};

ActivitySchema.statics.findPopular = function (destination, limit = 10) {
  return this.find({
    destination: new RegExp(destination, "i"),
    isActive: true,
  })
    .sort({ popularityScore: -1, "rating.average": -1 })
    .limit(limit);
};

ActivitySchema.statics.searchActivities = function (destination, filters = {}) {
  const query = {
    destination: new RegExp(destination, "i"),
    isActive: true,
  };

  if (filters.childFriendly) {
    query.childFriendly = true;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.maxPrice) {
    query["price.adult"] = { $lte: filters.maxPrice };
  }

  if (filters.minRating) {
    query["rating.average"] = { $gte: filters.minRating };
  }

  if (filters.wheelchairAccessible) {
    query["accessibility.wheelchairAccessible"] = true;
  }

  return this.find(query).sort({ "rating.average": -1 });
};

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);

// new done
