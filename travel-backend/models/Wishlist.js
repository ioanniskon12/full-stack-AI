// models/Wishlist.js - Enhanced wishlist model
import mongoose from "mongoose";

const WishlistItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Item Type and Reference
    itemType: {
      type: String,
      enum: ["trip", "destination", "hotel", "activity"],
      required: true,
    },
    itemId: String, // Reference to the actual item

    // Trip Data (for custom trips)
    tripData: {
      destination: String,
      startDate: Date,
      endDate: Date,
      hotel: String,
      price: String,
      basePrice: Number,
      image: String,
      destinationImage: String,
      activities: [Object],
      selectedActivities: [
        {
          name: String,
          price: Number,
          childFriendly: { type: Boolean, default: false },
        },
      ],
      flight: Object,
      duration: String,
      reason: String,

      // Enhanced trip data
      passengers: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 },
      },
      familyFeatures: {
        isChildFriendly: { type: Boolean, default: false },
        childFriendlyAmenities: [String],
      },
      weather: {
        forecast: [Object],
        averageTemp: String,
        bestConditions: String,
      },
    },

    // Enhanced Metadata
    title: String, // Custom title for the wishlist item
    notes: String,
    tags: [String], // User-defined tags
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Price Tracking
    priceAlert: {
      enabled: { type: Boolean, default: false },
      targetPrice: Number,
      currency: { type: String, default: "USD" },
      currentPrice: Number,
      priceHistory: [
        {
          price: Number,
          date: { type: Date, default: Date.now },
        },
      ],
      lastChecked: Date,
    },

    // Travel Planning
    plannedFor: {
      travelDates: {
        flexible: { type: Boolean, default: true },
        preferredStartDate: Date,
        preferredEndDate: Date,
        flexibilityDays: { type: Number, default: 7 },
      },
      travelWith: {
        type: String,
        enum: ["solo", "partner", "family", "friends", "group"],
        default: "solo",
      },
      budget: {
        min: Number,
        max: Number,
        currency: { type: String, default: "USD" },
      },
      specialRequests: String,
    },

    // Organization
    folder: {
      name: { type: String, default: "General" },
      color: { type: String, default: "#667eea" },
    },

    // Sharing
    shared: {
      isShared: { type: Boolean, default: false },
      sharedWith: [
        {
          email: String,
          name: String,
          permission: {
            type: String,
            enum: ["view", "edit"],
            default: "view",
          },
          sharedAt: { type: Date, default: Date.now },
        },
      ],
      shareLink: String,
      shareLinkExpires: Date,
    },

    // Interaction History
    viewCount: { type: Number, default: 0 },
    lastViewed: Date,
    bookingAttempts: { type: Number, default: 0 },

    // Timestamps
    addedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "booked", "expired", "archived"],
      default: "active",
    },
    bookedAt: Date,
    archivedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
WishlistItemSchema.index({ user: 1, addedAt: -1 });
WishlistItemSchema.index({ user: 1, itemType: 1 });
WishlistItemSchema.index({ user: 1, "folder.name": 1 });
WishlistItemSchema.index({ user: 1, status: 1 });
WishlistItemSchema.index({
  "priceAlert.enabled": 1,
  "priceAlert.targetPrice": 1,
});
WishlistItemSchema.index({ "shared.isShared": 1 });

// Update timestamp on save
WishlistItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Auto-update family features based on passengers
  if (this.tripData && this.tripData.passengers) {
    const hasChildren =
      this.tripData.passengers.children > 0 ||
      this.tripData.passengers.infants > 0;
    if (!this.tripData.familyFeatures) this.tripData.familyFeatures = {};
    this.tripData.familyFeatures.isChildFriendly = hasChildren;
  }

  next();
});

// Virtuals
WishlistItemSchema.virtual("isFamilyTrip").get(function () {
  return (
    this.tripData?.familyFeatures?.isChildFriendly ||
    this.tripData?.passengers?.children > 0 ||
    this.tripData?.passengers?.infants > 0
  );
});

WishlistItemSchema.virtual("totalPassengers").get(function () {
  if (!this.tripData?.passengers) return 1;
  const p = this.tripData.passengers;
  return (p.adults || 0) + (p.children || 0) + (p.infants || 0);
});

WishlistItemSchema.virtual("isPriceDropped").get(function () {
  if (
    !this.priceAlert.enabled ||
    !this.priceAlert.targetPrice ||
    !this.priceAlert.currentPrice
  ) {
    return false;
  }
  return this.priceAlert.currentPrice <= this.priceAlert.targetPrice;
});

WishlistItemSchema.virtual("formattedAddedDate").get(function () {
  return this.addedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

// Instance Methods
WishlistItemSchema.methods.incrementView = function () {
  this.viewCount += 1;
  this.lastViewed = new Date();
  return this.save();
};

WishlistItemSchema.methods.incrementBookingAttempt = function () {
  this.bookingAttempts += 1;
  return this.save();
};

WishlistItemSchema.methods.markAsBooked = function () {
  this.status = "booked";
  this.bookedAt = new Date();
  return this.save();
};

WishlistItemSchema.methods.archive = function () {
  this.status = "archived";
  this.archivedAt = new Date();
  return this.save();
};

WishlistItemSchema.methods.updatePrice = function (newPrice) {
  // Add to price history
  this.priceAlert.priceHistory.push({
    price: newPrice,
    date: new Date(),
  });

  // Keep only last 30 price points
  if (this.priceAlert.priceHistory.length > 30) {
    this.priceAlert.priceHistory = this.priceAlert.priceHistory.slice(-30);
  }

  this.priceAlert.currentPrice = newPrice;
  this.priceAlert.lastChecked = new Date();

  return this.save();
};

WishlistItemSchema.methods.enablePriceAlert = function (targetPrice) {
  this.priceAlert.enabled = true;
  this.priceAlert.targetPrice = targetPrice;
  this.priceAlert.lastChecked = new Date();
  return this.save();
};

WishlistItemSchema.methods.disablePriceAlert = function () {
  this.priceAlert.enabled = false;
  return this.save();
};

WishlistItemSchema.methods.shareWith = function (
  email,
  name,
  permission = "view"
) {
  // Check if already shared with this email
  const existingShare = this.shared.sharedWith.find(
    (share) => share.email === email
  );

  if (existingShare) {
    existingShare.permission = permission;
    existingShare.sharedAt = new Date();
  } else {
    this.shared.sharedWith.push({
      email,
      name,
      permission,
      sharedAt: new Date(),
    });
  }

  this.shared.isShared = true;
  return this.save();
};

WishlistItemSchema.methods.unshareWith = function (email) {
  this.shared.sharedWith = this.shared.sharedWith.filter(
    (share) => share.email !== email
  );

  if (this.shared.sharedWith.length === 0) {
    this.shared.isShared = false;
  }

  return this.save();
};

WishlistItemSchema.methods.createShareLink = function (expiryDays = 30) {
  const shareId = new mongoose.Types.ObjectId().toString();
  this.shared.shareLink = shareId;
  this.shared.shareLinkExpires = new Date(
    Date.now() + expiryDays * 24 * 60 * 60 * 1000
  );
  this.shared.isShared = true;
  return this.save();
};

WishlistItemSchema.methods.moveToFolder = function (
  folderName,
  color = "#667eea"
) {
  this.folder.name = folderName;
  this.folder.color = color;
  return this.save();
};

// Static Methods
WishlistItemSchema.statics.findByUser = function (userId, filters = {}) {
  const query = { user: userId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.itemType) {
    query.itemType = filters.itemType;
  }

  if (filters.folder) {
    query["folder.name"] = filters.folder;
  }

  if (filters.familyTrips) {
    query.$or = [
      { "tripData.familyFeatures.isChildFriendly": true },
      { "tripData.passengers.children": { $gt: 0 } },
      { "tripData.passengers.infants": { $gt: 0 } },
    ];
  }

  return this.find(query).sort({ addedAt: -1 });
};

WishlistItemSchema.statics.findFamilyWishlistItems = function (userId) {
  return this.find({
    user: userId,
    $or: [
      { "tripData.familyFeatures.isChildFriendly": true },
      { "tripData.passengers.children": { $gt: 0 } },
      { "tripData.passengers.infants": { $gt: 0 } },
    ],
    status: "active",
  }).sort({ addedAt: -1 });
};

WishlistItemSchema.statics.findPriceAlerts = function () {
  return this.find({
    "priceAlert.enabled": true,
    status: "active",
    $or: [
      { "priceAlert.lastChecked": { $exists: false } },
      {
        "priceAlert.lastChecked": {
          $lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      }, // Not checked in 24 hours
    ],
  });
};

WishlistItemSchema.statics.findByShareLink = function (shareLink) {
  return this.findOne({
    "shared.shareLink": shareLink,
    "shared.shareLinkExpires": { $gt: new Date() },
    "shared.isShared": true,
  });
};

WishlistItemSchema.statics.getUserFolders = function (userId) {
  return this.aggregate([
    { $match: { user: userId, status: "active" } },
    {
      $group: {
        _id: "$folder.name",
        color: { $first: "$folder.color" },
        count: { $sum: 1 },
        lastUpdated: { $max: "$updatedAt" },
      },
    },
    { $sort: { lastUpdated: -1 } },
  ]);
};

WishlistItemSchema.statics.getWishlistAnalytics = function (userId) {
  return this.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        activeItems: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        bookedItems: {
          $sum: { $cond: [{ $eq: ["$status", "booked"] }, 1, 0] },
        },
        familyItems: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $eq: ["$tripData.familyFeatures.isChildFriendly", true] },
                  { $gt: ["$tripData.passengers.children", 0] },
                  { $gt: ["$tripData.passengers.infants", 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        priceAlertsEnabled: { $sum: { $cond: ["$priceAlert.enabled", 1, 0] } },
        avgPrice: { $avg: "$tripData.basePrice" },
        totalViews: { $sum: "$viewCount" },
        itemsByType: {
          $push: {
            type: "$itemType",
            status: "$status",
          },
        },
      },
    },
  ]);
};

export default mongoose.models.WishlistItem ||
  mongoose.model("WishlistItem", WishlistItemSchema);

// new done
