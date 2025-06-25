// models/User.js - Enhanced with travel preferences and family features
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Basic Information
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    firstName: String,
    lastName: String,
    image: {
      type: String,
      default: null,
    },

    // Role and Permissions
    role: {
      type: String,
      enum: ["user", "admin", "agent", "manager"],
      default: "user",
    },
    permissions: [
      {
        type: String,
        enum: [
          "view_bookings",
          "edit_bookings",
          "cancel_bookings",
          "manage_users",
          "view_analytics",
          "handle_requests",
        ],
      },
    ],

    // Contact Information
    phone: {
      type: String,
      trim: true,
    },
    alternatePhone: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },

    // Personal Details
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    nationality: String,

    // Enhanced Address Information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      isDefault: { type: Boolean, default: true },
    },

    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },

    // Travel Preferences
    travelPreferences: {
      // Accommodation Preferences
      accommodationType: {
        type: String,
        enum: ["hotel", "resort", "apartment", "hostel", "villa", "any"],
        default: "hotel",
      },
      roomType: {
        type: String,
        enum: ["single", "double", "twin", "suite", "family", "any"],
        default: "double",
      },
      starRating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
      },

      // Flight Preferences
      seatPreference: {
        type: String,
        enum: ["window", "aisle", "middle", "any"],
        default: "any",
      },
      classPreference: {
        type: String,
        enum: ["economy", "premium_economy", "business", "first", "any"],
        default: "economy",
      },
      airlinePreferences: [String], // Preferred airlines

      // Travel Style
      budgetRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
      travelStyle: {
        type: String,
        enum: [
          "budget",
          "comfort",
          "luxury",
          "adventure",
          "family",
          "business",
        ],
        default: "comfort",
      },

      // Activity Preferences
      activityTypes: [
        {
          type: String,
          enum: [
            "cultural",
            "adventure",
            "relaxation",
            "nightlife",
            "shopping",
            "nature",
            "family",
            "food",
            "sports",
          ],
        },
      ],

      // Dietary Requirements
      dietaryRestrictions: [
        {
          type: String,
          enum: [
            "vegetarian",
            "vegan",
            "halal",
            "kosher",
            "gluten_free",
            "dairy_free",
            "nut_allergy",
            "other",
          ],
        },
      ],
      customDietaryNotes: String,

      // Accessibility Needs
      accessibilityNeeds: [
        {
          type: String,
          enum: [
            "wheelchair_access",
            "hearing_assistance",
            "visual_assistance",
            "mobility_assistance",
            "other",
          ],
        },
      ],
      accessibilityNotes: String,

      // Language Preferences
      preferredLanguages: [String],
    },

    // Family Information
    familyInfo: {
      isParent: { type: Boolean, default: false },
      children: [
        {
          name: String,
          dateOfBirth: Date,
          age: Number,
          specialNeeds: String,
          dietaryRestrictions: [String],
        },
      ],

      // Travel companions
      frequentCompanions: [
        {
          name: String,
          relationship: String,
          email: String,
          phone: String,
        },
      ],

      // Child-specific preferences
      childCarePreferences: {
        needsCarSeat: { type: Boolean, default: false },
        carSeatType: {
          type: String,
          enum: ["infant", "convertible", "booster"],
        },
        needsStroller: { type: Boolean, default: false },
        needsBabyCot: { type: Boolean, default: false },
      },
    },

    // Enhanced Documents
    documents: {
      passport: {
        url: String,
        number: String,
        expiryDate: Date,
        issuingCountry: String,
        uploadedAt: Date,
        verified: { type: Boolean, default: false },
      },
      idCard: {
        url: String,
        number: String,
        type: {
          type: String,
          enum: ["drivers_license", "national_id", "other"],
        },
        expiryDate: Date,
        uploadedAt: Date,
        verified: { type: Boolean, default: false },
      },
      visa: [
        {
          country: String,
          url: String,
          number: String,
          expiryDate: Date,
          uploadedAt: Date,
          verified: { type: Boolean, default: false },
        },
      ],
      paymentCards: [
        {
          url: String,
          last4: String,
          brand: String,
          expiryMonth: Number,
          expiryYear: Number,
          cardholderName: String,
          isDefault: { type: Boolean, default: false },
          uploadedAt: Date,
        },
      ],
    },

    // Loyalty and Rewards
    loyaltyPrograms: [
      {
        airline: String,
        membershipNumber: String,
        tier: String,
      },
    ],
    rewardPoints: { type: Number, default: 0 },

    // Travel History and Analytics
    travelStats: {
      totalTrips: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
      favoriteDestinations: [String],
      lastTripDate: Date,
      averageTripDuration: Number, // in days
      preferredMonths: [String], // months they typically travel
      totalActivitiesBooked: { type: Number, default: 0 },
    },

    // Enhanced Preferences
    preferences: {
      currency: {
        type: String,
        default: "USD",
      },
      language: {
        type: String,
        default: "en",
      },
      newsletter: {
        type: Boolean,
        default: true,
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: true },
        bookingUpdates: { type: Boolean, default: true },
        weatherAlerts: { type: Boolean, default: true },
      },
    },

    // Security and Verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorSecret: String,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    passwordChangedAt: Date,

    // Account Status
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "banned"],
      default: "active",
    },

    // Marketing and Communication
    marketingConsent: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      phone: { type: Boolean, default: false },
      consentDate: Date,
    },

    // Search and Booking History
    searchHistory: [
      {
        query: String,
        destination: String,
        searchDate: { type: Date, default: Date.now },
        passengers: {
          adults: Number,
          children: Number,
          infants: Number,
        },
      },
    ],

    // Wishlist
    wishlist: [
      {
        type: {
          type: String,
          enum: ["destination", "hotel", "activity", "trip"],
        },
        itemId: String,
        itemName: String,
        itemImage: String,
        notes: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],

    // Customer Service
    customerServiceNotes: [
      {
        note: String,
        addedBy: String,
        addedAt: { type: Date, default: Date.now },
        isImportant: { type: Boolean, default: false },
      },
    ],

    // API and Integration
    integrations: {
      stripeCustomerId: String,
      googleId: String,
      facebookId: String,
      appleId: String,
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
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Enhanced Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ "travelPreferences.travelStyle": 1 });
UserSchema.index({ "familyInfo.isParent": 1 });
UserSchema.index({ lastActive: -1 });

// Update timestamps and derived fields on save
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Update first/last name from full name if not set
  if (this.name && !this.firstName && !this.lastName) {
    const nameParts = this.name.split(" ");
    this.firstName = nameParts[0];
    this.lastName = nameParts.slice(1).join(" ");
  }

  // Update full name if first/last names are set
  if (this.firstName && this.lastName && !this.name) {
    this.name = `${this.firstName} ${this.lastName}`;
  }

  // Update isParent flag based on children
  if (
    this.familyInfo &&
    this.familyInfo.children &&
    this.familyInfo.children.length > 0
  ) {
    this.familyInfo.isParent = true;
  }

  next();
});

// Enhanced Virtuals
UserSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.name;
});

UserSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

UserSchema.virtual("fullAddress").get(function () {
  if (!this.address?.street) return "";
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
});

UserSchema.virtual("totalChildren").get(function () {
  return this.familyInfo?.children?.length || 0;
});

UserSchema.virtual("isFamilyUser").get(function () {
  return this.familyInfo?.isParent || this.totalChildren > 0;
});

// Enhanced Instance Methods
UserSchema.methods.isAdmin = function () {
  return this.role === "admin" || this.role === "manager";
};

UserSchema.methods.canHandleRequests = function () {
  return (
    this.isAdmin() ||
    this.role === "agent" ||
    this.permissions?.includes("handle_requests")
  );
};

UserSchema.methods.addToWishlist = function (
  type,
  itemId,
  itemName,
  itemImage,
  notes
) {
  const exists = this.wishlist.find(
    (item) => item.itemId === itemId && item.type === type
  );
  if (!exists) {
    this.wishlist.push({ type, itemId, itemName, itemImage, notes });
    return this.save();
  }
  return Promise.resolve(this);
};

UserSchema.methods.removeFromWishlist = function (itemId, type) {
  this.wishlist = this.wishlist.filter(
    (item) => !(item.itemId === itemId && item.type === type)
  );
  return this.save();
};

UserSchema.methods.updateTravelStats = function (tripData) {
  if (!this.travelStats) this.travelStats = {};

  this.travelStats.totalTrips = (this.travelStats.totalTrips || 0) + 1;
  this.travelStats.totalSpent =
    (this.travelStats.totalSpent || 0) + (tripData.totalPrice || 0);
  this.travelStats.lastTripDate = tripData.endDate || new Date();

  // Add to favorite destinations
  if (tripData.destination) {
    if (!this.travelStats.favoriteDestinations)
      this.travelStats.favoriteDestinations = [];
    const dest = tripData.destination.split(",")[0].trim();
    if (!this.travelStats.favoriteDestinations.includes(dest)) {
      this.travelStats.favoriteDestinations.push(dest);
    }
  }

  return this.save();
};

UserSchema.methods.addCustomerServiceNote = function (
  note,
  addedBy,
  isImportant = false
) {
  this.customerServiceNotes.push({
    note,
    addedBy,
    isImportant,
    addedAt: new Date(),
  });
  return this.save();
};

UserSchema.methods.updateLastActive = function () {
  this.lastActive = new Date();
  return this.save();
};

UserSchema.methods.addSearchToHistory = function (
  query,
  destination,
  passengers
) {
  this.searchHistory.push({
    query,
    destination,
    passengers,
    searchDate: new Date(),
  });

  // Keep only last 50 searches
  if (this.searchHistory.length > 50) {
    this.searchHistory = this.searchHistory.slice(-50);
  }

  return this.save();
};

// Enhanced Static Methods
UserSchema.statics.findFamilyUsers = function () {
  return this.find({
    $or: [
      { "familyInfo.isParent": true },
      { "familyInfo.children.0": { $exists: true } },
    ],
  });
};

UserSchema.statics.findByTravelStyle = function (style) {
  return this.find({ "travelPreferences.travelStyle": style });
};

UserSchema.statics.findFrequentTravelers = function (minTrips = 5) {
  return this.find({ "travelStats.totalTrips": { $gte: minTrips } });
};

UserSchema.statics.getUserAnalytics = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        familyUsers: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $eq: ["$familyInfo.isParent", true] },
                  {
                    $gt: [
                      { $size: { $ifNull: ["$familyInfo.children", []] } },
                      0,
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        avgTotalSpent: { $avg: "$travelStats.totalSpent" },
        travelStyleDistribution: {
          $push: "$travelPreferences.travelStyle",
        },
      },
    },
  ]);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
// new done
