// models/User.js - Enhanced with travel preferences and family features
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  firstName: { type: String },
  lastName: { type: String },
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
  phone: { type: String },
  alternatePhone: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String },
  },

  // Personal Details
  dateOfBirth: { type: Date },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer_not_to_say"],
  },
  nationality: { type: String },

  // Address Information
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    isDefault: { type: Boolean, default: true },
  },

  // Legacy address fields (for backward compatibility)
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },

  bio: { type: String, maxlength: 500 },

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
    airlinePreferences: [{ type: String }], // Preferred airlines

    // Travel Style
    budgetRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000 },
    },
    travelStyle: {
      type: String,
      enum: ["budget", "comfort", "luxury", "adventure", "family", "business"],
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
    customDietaryNotes: { type: String },

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
    accessibilityNotes: { type: String },

    // Language Preferences
    preferredLanguages: [{ type: String }],

    // Notification Preferences
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      weatherAlerts: { type: Boolean, default: true },
    },
  },

  // Family Information
  familyInfo: {
    isParent: { type: Boolean, default: false },
    children: [
      {
        name: { type: String },
        dateOfBirth: { type: Date },
        age: { type: Number },
        specialNeeds: { type: String },
        dietaryRestrictions: [{ type: String }],
      },
    ],

    // Travel companions
    frequentCompanions: [
      {
        name: { type: String },
        relationship: { type: String },
        email: { type: String },
        phone: { type: String },
      },
    ],

    // Child-specific preferences
    childCarPreferences: {
      needsCarSeat: { type: Boolean, default: false },
      carSeatType: { type: String, enum: ["infant", "convertible", "booster"] },
      needsStroller: { type: Boolean, default: false },
      needsBabyCot: { type: Boolean, default: false },
    },
  },

  // Documents and Verification
  documents: {
    passport: {
      url: { type: String },
      number: { type: String },
      expiryDate: { type: Date },
      issuingCountry: { type: String },
      uploadedAt: { type: Date },
      verified: { type: Boolean, default: false },
    },
    id: {
      url: { type: String },
      number: { type: String },
      type: { type: String, enum: ["drivers_license", "national_id", "other"] },
      expiryDate: { type: Date },
      uploadedAt: { type: Date },
      verified: { type: Boolean, default: false },
    },
    visa: [
      {
        country: { type: String },
        url: { type: String },
        number: { type: String },
        expiryDate: { type: Date },
        uploadedAt: { type: Date },
        verified: { type: Boolean, default: false },
      },
    ],
    paymentCards: [
      {
        url: { type: String },
        last4: { type: String },
        brand: { type: String },
        expiryMonth: { type: Number },
        expiryYear: { type: Number },
        cardholderName: { type: String },
        isDefault: { type: Boolean, default: false },
        uploadedAt: { type: Date },
      },
    ],
  },

  // Loyalty and Rewards
  loyaltyPrograms: [
    {
      airline: { type: String },
      membershipNumber: { type: String },
      tier: { type: String },
    },
  ],
  rewardPoints: { type: Number, default: 0 },

  // Travel History and Analytics
  travelStats: {
    totalTrips: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteDestinations: [{ type: String }],
    lastTripDate: { type: Date },
    averageTripDuration: { type: Number }, // in days
    preferredMonths: [{ type: String }], // months they typically travel
    totalActivitiesBooked: { type: Number, default: 0 },
  },

  // Account Security
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  lastLogin: { type: Date },
  passwordChangedAt: { type: Date },

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
    consentDate: { type: Date },
  },

  // Search and Booking History
  searchHistory: [
    {
      query: { type: String },
      destination: { type: String },
      searchDate: { type: Date, default: Date.now },
      passengers: {
        adults: { type: Number },
        children: { type: Number },
        infants: { type: Number },
      },
    },
  ],

  // Wishlist and Saved Items
  wishlist: [
    {
      type: {
        type: String,
        enum: ["destination", "hotel", "activity", "trip"],
      },
      itemId: { type: String },
      itemName: { type: String },
      itemImage: { type: String },
      notes: { type: String },
      addedAt: { type: Date, default: Date.now },
    },
  ],

  // Customer Service
  customerServiceNotes: [
    {
      note: { type: String },
      addedBy: { type: String },
      addedAt: { type: Date, default: Date.now },
      isImportant: { type: Boolean, default: false },
    },
  ],

  // API and Integration
  integrations: {
    stripeCustomerId: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    appleId: { type: String },
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
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ "travelPreferences.travelStyle": 1 });
UserSchema.index({ "familyInfo.isParent": 1 });
UserSchema.index({ lastActive: -1 });

// Update timestamps on save
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

// Virtual for full name
UserSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.name;
});

// Virtual for age
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

// Virtual for total children
UserSchema.virtual("totalChildren").get(function () {
  return this.familyInfo?.children?.length || 0;
});

// Virtual for is family user
UserSchema.virtual("isFamilyUser").get(function () {
  return this.familyInfo?.isParent || this.totalChildren > 0;
});

// Instance method to check if user is admin
UserSchema.methods.isAdmin = function () {
  return this.role === "admin" || this.role === "manager";
};

// Instance method to check if user can handle requests
UserSchema.methods.canHandleRequests = function () {
  return (
    this.isAdmin() ||
    this.role === "agent" ||
    this.permissions?.includes("handle_requests")
  );
};

// Instance method to add to wishlist
UserSchema.methods.addToWishlist = function (
  type,
  itemId,
  itemName,
  itemImage,
  notes
) {
  // Check if item already exists
  const exists = this.wishlist.find(
    (item) => item.itemId === itemId && item.type === type
  );
  if (!exists) {
    this.wishlist.push({ type, itemId, itemName, itemImage, notes });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove from wishlist
UserSchema.methods.removeFromWishlist = function (itemId, type) {
  this.wishlist = this.wishlist.filter(
    (item) => !(item.itemId === itemId && item.type === type)
  );
  return this.save();
};

// Instance method to update travel stats
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

// Instance method to add customer service note
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

// Instance method to update last active
UserSchema.methods.updateLastActive = function () {
  this.lastActive = new Date();
  return this.save();
};

// Static method to find family users
UserSchema.statics.findFamilyUsers = function () {
  return this.find({
    $or: [
      { "familyInfo.isParent": true },
      { "familyInfo.children.0": { $exists: true } },
    ],
  });
};

// Static method to find users by travel style
UserSchema.statics.findByTravelStyle = function (style) {
  return this.find({ "travelPreferences.travelStyle": style });
};

// Static method to find frequent travelers
UserSchema.statics.findFrequentTravelers = function (minTrips = 5) {
  return this.find({ "travelStats.totalTrips": { $gte: minTrips } });
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
