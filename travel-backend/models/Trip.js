// models/Trip.js - Enhanced destination/trip template model
import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    // Basic Information
    destination: {
      type: String,
      required: true,
    },
    country: String,
    city: String,
    region: String,
    continent: String,

    // Enhanced Content
    description: String,
    shortDescription: String,
    highlights: [String],

    // Images and Media
    images: [
      {
        url: String,
        alt: String,
        caption: String,
        isCover: { type: Boolean, default: false },
        category: {
          type: String,
          enum: [
            "landscape",
            "culture",
            "food",
            "activities",
            "hotels",
            "general",
          ],
          default: "general",
        },
      },
    ],
    videos: [
      {
        url: String,
        title: String,
        duration: String,
        thumbnail: String,
      },
    ],

    // Trip Duration Options
    duration: {
      min: Number,
      max: Number,
      recommended: Number,
      options: [
        {
          days: Number,
          title: String,
          description: String,
          highlights: [String],
        },
      ],
    },

    // Best Time to Visit with Weather
    bestTimeToVisit: {
      months: [String],
      weatherInfo: {
        peakSeason: {
          months: [String],
          weather: String,
          crowds: String,
          prices: String,
        },
        shoulderSeason: {
          months: [String],
          weather: String,
          crowds: String,
          prices: String,
        },
        offSeason: {
          months: [String],
          weather: String,
          crowds: String,
          prices: String,
        },
      },
      familyFriendlyMonths: [String], // Best months for families
    },

    // Enhanced Climate and Weather
    climate: {
      type: String,
      averageTemperature: {
        jan: String,
        feb: String,
        mar: String,
        apr: String,
        may: String,
        jun: String,
        jul: String,
        aug: String,
        sep: String,
        oct: String,
        nov: String,
        dec: String,
      },
      rainfallPattern: String,
      weatherWarnings: [String],
    },

    // Pricing Information
    priceRange: {
      budget: {
        min: Number,
        max: Number,
        description: String,
      },
      midRange: {
        min: Number,
        max: Number,
        description: String,
      },
      luxury: {
        min: Number,
        max: Number,
        description: String,
      },
      currency: { type: String, default: "USD" },
      familyBudgetTips: [String],
    },

    // Enhanced Activities
    popularActivities: [
      {
        name: String,
        description: String,
        price: Number,
        duration: String,
        category: String,
        childFriendly: { type: Boolean, default: false },
        minAge: Number,
        image: String,
        rating: Number,
        mustDo: { type: Boolean, default: false },
      },
    ],

    // Family-Specific Information
    familyInfo: {
      familyFriendly: { type: Boolean, default: false },
      bestAgesForChildren: {
        min: Number,
        max: Number,
        notes: String,
      },
      familyActivities: [String],
      childcareFacilities: [String],
      familyAccommodations: [String],
      safetyRating: { type: Number, min: 1, max: 5 },
      healthcareQuality: { type: Number, min: 1, max: 5 },
      kidfriendlyRestaurants: [String],
      playgrounds: [String],
      emergencyNumbers: [
        {
          service: String,
          number: String,
        },
      ],
    },

    // Enhanced Hotels
    recommendedHotels: [
      {
        name: String,
        rating: Number,
        pricePerNight: Number,
        location: String,
        amenities: [String],
        familyFriendly: { type: Boolean, default: false },
        childAmenities: [String],
        image: String,
        bookingUrl: String,
        category: {
          type: String,
          enum: ["budget", "midrange", "luxury", "family"],
        },
      },
    ],

    // Transportation
    transportation: {
      airports: [
        {
          code: String,
          name: String,
          distance: String,
          international: { type: Boolean, default: true },
        },
      ],
      localTransport: [String],
      familyTransportTips: [String],
      carRentalAvailable: { type: Boolean, default: true },
      publicTransportQuality: { type: Number, min: 1, max: 5 },
    },

    // Enhanced Flight Information
    flights: [
      {
        from: String,
        airline: String,
        averagePrice: Number,
        duration: String,
        directFlight: { type: Boolean, default: false },
        frequency: String, // "daily", "weekly", etc.
      },
    ],

    // Cultural and Practical Information
    culturalInfo: {
      languages: [String],
      currency: String,
      timeZone: String,
      culturalTips: [String],
      dressCode: String,
      tipping: String,
      businessHours: String,
    },

    // Travel Requirements
    travelRequirements: {
      visaRequired: Boolean,
      visaInfo: String,
      vaccinationsRequired: [String],
      healthInsuranceRecommended: { type: Boolean, default: true },
      travelInsuranceRecommended: { type: Boolean, default: true },
    },

    // Enhanced Tags and Categories
    tags: [String],
    categories: [
      {
        type: String,
        enum: [
          "beach",
          "city",
          "culture",
          "adventure",
          "nature",
          "history",
          "food",
          "nightlife",
          "luxury",
          "budget",
          "family",
          "romantic",
          "backpacking",
          "wellness",
          "business",
          "wildlife",
          "mountains",
          "islands",
          "desert",
          "winter",
          "summer",
        ],
      },
    ],

    // Ratings and Reviews
    ratings: {
      overall: { type: Number, default: 0 },
      culture: { type: Number, default: 0 },
      nightlife: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      familyFriendliness: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
    },

    // Popularity and SEO
    popularityScore: { type: Number, default: 0 },
    searchKeywords: [String],
    seoDescription: String,
    trending: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },

    // Administrative
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },

    // Analytics
    views: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    wishlisted: { type: Number, default: 0 },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TripSchema.index({ destination: 1 });
TripSchema.index({ country: 1, city: 1 });
TripSchema.index({ tags: 1 });
TripSchema.index({ categories: 1 });
TripSchema.index({ popularityScore: -1 });
TripSchema.index({ "ratings.overall": -1 });
TripSchema.index({ "familyInfo.familyFriendly": 1 });
TripSchema.index({ featured: 1, trending: 1 });
TripSchema.index({ isActive: 1 });

// Virtuals
TripSchema.virtual("coverImage").get(function () {
  const coverImg = this.images.find((img) => img.isCover);
  return coverImg || this.images[0] || null;
});

TripSchema.virtual("averagePrice").get(function () {
  const midRange = this.priceRange?.midRange;
  if (midRange && midRange.min && midRange.max) {
    return (midRange.min + midRange.max) / 2;
  }
  return null;
});

TripSchema.virtual("isFamilyDestination").get(function () {
  return (
    this.familyInfo?.familyFriendly ||
    this.categories?.includes("family") ||
    this.ratings?.familyFriendliness >= 3.5
  );
});

TripSchema.virtual("bestFamilyMonths").get(function () {
  return (
    this.bestTimeToVisit?.familyFriendlyMonths ||
    this.bestTimeToVisit?.months ||
    []
  );
});

// Instance Methods
TripSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

TripSchema.methods.incrementBookings = function () {
  this.bookings += 1;
  this.popularityScore += 2; // Bookings are worth more than views
  return this.save();
};

TripSchema.methods.incrementWishlisted = function () {
  this.wishlisted += 1;
  this.popularityScore += 1;
  return this.save();
};

TripSchema.methods.updateRating = function (category, newRating) {
  if (this.ratings[category] !== undefined) {
    this.ratings[category] = newRating;

    // Recalculate overall rating
    const ratingCategories = [
      "culture",
      "nightlife",
      "food",
      "value",
      "safety",
    ];
    const total = ratingCategories.reduce(
      (sum, cat) => sum + (this.ratings[cat] || 0),
      0
    );
    this.ratings.overall = total / ratingCategories.length;

    this.lastUpdated = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

TripSchema.methods.getFamilyActivities = function () {
  return this.popularActivities.filter((activity) => activity.childFriendly);
};

TripSchema.methods.getFamilyHotels = function () {
  return this.recommendedHotels.filter((hotel) => hotel.familyFriendly);
};

TripSchema.methods.getBestMonthsForFamily = function () {
  return (
    this.bestTimeToVisit?.familyFriendlyMonths ||
    this.bestTimeToVisit?.months?.filter((month) => {
      // Filter out extreme weather months that might not be good for families
      const season = this.bestTimeToVisit.weatherInfo;
      return (
        season?.peakSeason?.months?.includes(month) ||
        season?.shoulderSeason?.months?.includes(month)
      );
    }) ||
    []
  );
};

// Static Methods
TripSchema.statics.findFamilyDestinations = function (limit = 10) {
  return this.find({
    $or: [
      { "familyInfo.familyFriendly": true },
      { categories: "family" },
      { "ratings.familyFriendliness": { $gte: 3.5 } },
    ],
    isActive: true,
  })
    .sort({ "ratings.familyFriendliness": -1, popularityScore: -1 })
    .limit(limit);
};

TripSchema.statics.findByCategory = function (category, limit = 10) {
  return this.find({
    categories: category,
    isActive: true,
  })
    .sort({ popularityScore: -1, "ratings.overall": -1 })
    .limit(limit);
};

TripSchema.statics.findTrending = function (limit = 10) {
  return this.find({
    trending: true,
    isActive: true,
  })
    .sort({ popularityScore: -1 })
    .limit(limit);
};

TripSchema.statics.searchDestinations = function (query, filters = {}) {
  const searchQuery = {
    $or: [
      { destination: new RegExp(query, "i") },
      { city: new RegExp(query, "i") },
      { country: new RegExp(query, "i") },
      { tags: new RegExp(query, "i") },
      { searchKeywords: new RegExp(query, "i") },
    ],
    isActive: true,
  };

  if (filters.familyFriendly) {
    searchQuery["familyInfo.familyFriendly"] = true;
  }

  if (filters.categories && filters.categories.length > 0) {
    searchQuery.categories = { $in: filters.categories };
  }

  if (filters.maxPrice) {
    searchQuery["priceRange.midRange.max"] = { $lte: filters.maxPrice };
  }

  if (filters.minRating) {
    searchQuery["ratings.overall"] = { $gte: filters.minRating };
  }

  return this.find(searchQuery).sort({
    popularityScore: -1,
    "ratings.overall": -1,
  });
};

TripSchema.statics.getDestinationAnalytics = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$continent",
        totalDestinations: { $sum: 1 },
        avgRating: { $avg: "$ratings.overall" },
        totalViews: { $sum: "$views" },
        totalBookings: { $sum: "$bookings" },
        familyDestinations: {
          $sum: { $cond: ["$familyInfo.familyFriendly", 1, 0] },
        },
      },
    },
    { $sort: { totalBookings: -1 } },
  ]);
};

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);

// new done
