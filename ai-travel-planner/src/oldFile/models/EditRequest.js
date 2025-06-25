// models/EditRequest.js - Enhanced with better tracking and features
import mongoose from "mongoose";

const EditRequestSchema = new mongoose.Schema({
  // References
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  bookingId: {
    type: String, // Backup string ID for easier querying
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  userEmail: {
    type: String,
    required: true, // Always require email for contact
  },

  // Request Details
  requestType: {
    type: String,
    enum: [
      "date_change",
      "hotel_change",
      "activity_change",
      "flight_change",
      "passenger_change",
      "budget_change",
      "destination_change",
      "cancellation",
      "refund",
      "upgrade",
      "child_amenities", // New: For family-specific requests
      "weather_concern", // New: Weather-related changes
      "other",
    ],
    default: "other",
  },

  // Request Content
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },

  // Priority Level
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },

  // Proposed Changes (structured data)
  proposedChanges: {
    startDate: { type: Date },
    endDate: { type: Date },
    hotel: { type: String },
    activities: { type: String },
    passengers: {
      adults: { type: Number },
      children: { type: Number },
      infants: { type: Number },
    },
    budget: { type: Number },
    destination: { type: String },
    specialRequests: { type: String },
  },

  // Current Trip Details (snapshot at time of request)
  originalTripDetails: {
    destination: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    hotel: { type: String },
    totalPrice: { type: Number },
    passengers: {
      adults: { type: Number },
      children: { type: Number },
      infants: { type: Number },
    },
    selectedActivities: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
  },

  // Status Tracking
  status: {
    type: String,
    enum: [
      "pending",
      "acknowledged",
      "in_progress",
      "approved",
      "rejected",
      "completed",
      "cancelled",
    ],
    default: "pending",
  },

  // Communication
  adminNotes: { type: String },
  customerResponse: { type: String },
  internalNotes: [
    {
      note: { type: String },
      addedBy: { type: String },
      addedAt: { type: Date, default: Date.now },
    },
  ],

  // Resolution
  resolution: { type: String },
  resolutionType: {
    type: String,
    enum: [
      "approved_as_requested",
      "approved_with_modifications",
      "alternative_offered",
      "rejected",
      "cancelled",
    ],
  },

  // Financial Impact
  priceChange: { type: Number, default: 0 }, // Positive = additional cost, Negative = refund
  refundAmount: { type: Number, default: 0 },
  additionalFees: { type: Number, default: 0 },

  // File Attachments (for supporting documents)
  attachments: [
    {
      filename: { type: String },
      originalName: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],

  // Communication History
  communications: [
    {
      type: {
        type: String,
        enum: ["email", "phone", "chat", "internal_note"],
        default: "email",
      },
      from: { type: String }, // email or staff name
      to: { type: String },
      subject: { type: String },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
      isInternal: { type: Boolean, default: false },
    },
  ],

  // Special Flags
  isUrgent: {
    type: Boolean,
    default: function () {
      return this.priority === "urgent";
    },
  },
  isFamilyRelated: {
    type: Boolean,
    default: function () {
      return (
        this.requestType === "child_amenities" ||
        this.originalTripDetails?.passengers?.children > 0 ||
        this.originalTripDetails?.passengers?.infants > 0
      );
    },
  },
  requiresApproval: {
    type: Boolean,
    default: function () {
      return [
        "date_change",
        "hotel_change",
        "destination_change",
        "cancellation",
        "refund",
      ].includes(this.requestType);
    },
  },

  // Deadlines
  requestedBy: { type: Date }, // Customer's desired resolution date
  estimatedResolution: { type: Date },
  actualResolution: { type: Date },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  acknowledgedAt: { type: Date },
  resolvedAt: { type: Date },

  // Staff Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedToEmail: { type: String },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resolvedByEmail: { type: String },

  // Integration Data
  externalTicketId: { type: String }, // For third-party ticket systems
  stripeRefundId: { type: String }, // For Stripe refunds

  // Auto-categorization
  category: {
    type: String,
    enum: ["simple", "complex", "financial", "urgent", "family", "weather"],
    default: function () {
      if (this.priority === "urgent") return "urgent";
      if (this.isFamilyRelated) return "family";
      if (this.requestType === "weather_concern") return "weather";
      if (["cancellation", "refund"].includes(this.requestType))
        return "financial";
      if (["destination_change", "date_change"].includes(this.requestType))
        return "complex";
      return "simple";
    },
  },
});

// Indexes for better performance
EditRequestSchema.index({ userEmail: 1, createdAt: -1 });
EditRequestSchema.index({ bookingId: 1 });
EditRequestSchema.index({ status: 1, priority: 1 });
EditRequestSchema.index({ requestType: 1 });
EditRequestSchema.index({ assignedTo: 1, status: 1 });
EditRequestSchema.index({ createdAt: -1 });

// Update the updatedAt timestamp on save
EditRequestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Auto-set resolved timestamp when status changes to completed
  if (
    this.isModified("status") &&
    ["completed", "rejected", "cancelled"].includes(this.status) &&
    !this.resolvedAt
  ) {
    this.resolvedAt = Date.now();
    this.actualResolution = Date.now();
  }

  // Auto-set acknowledged timestamp when status changes from pending
  if (
    this.isModified("status") &&
    this.status !== "pending" &&
    !this.acknowledgedAt
  ) {
    this.acknowledgedAt = Date.now();
  }

  next();
});

// Virtual for response time (in hours)
EditRequestSchema.virtual("responseTimeHours").get(function () {
  if (!this.acknowledgedAt) return null;
  return (
    Math.round(
      ((this.acknowledgedAt - this.createdAt) / (1000 * 60 * 60)) * 10
    ) / 10
  );
});

// Virtual for resolution time (in hours)
EditRequestSchema.virtual("resolutionTimeHours").get(function () {
  if (!this.resolvedAt) return null;
  return (
    Math.round(((this.resolvedAt - this.createdAt) / (1000 * 60 * 60)) * 10) /
    10
  );
});

// Virtual for if request is overdue
EditRequestSchema.virtual("isOverdue").get(function () {
  if (this.resolvedAt || !this.estimatedResolution) return false;
  return new Date() > this.estimatedResolution;
});

// Instance method to add communication
EditRequestSchema.methods.addCommunication = function (
  type,
  from,
  to,
  subject,
  message,
  isInternal = false
) {
  this.communications.push({
    type,
    from,
    to,
    subject,
    message,
    isInternal,
    timestamp: new Date(),
  });
  return this.save();
};

// Instance method to add internal note
EditRequestSchema.methods.addInternalNote = function (note, addedBy) {
  this.internalNotes.push({
    note,
    addedBy,
    addedAt: new Date(),
  });
  return this.save();
};

// Instance method to assign to staff
EditRequestSchema.methods.assignTo = function (userId, userEmail) {
  this.assignedTo = userId;
  this.assignedToEmail = userEmail;
  if (this.status === "pending") {
    this.status = "acknowledged";
  }
  return this.save();
};

// Instance method to resolve request
EditRequestSchema.methods.resolve = function (
  resolution,
  resolutionType,
  resolvedBy,
  resolvedByEmail,
  priceChange = 0
) {
  this.status = "completed";
  this.resolution = resolution;
  this.resolutionType = resolutionType;
  this.resolvedBy = resolvedBy;
  this.resolvedByEmail = resolvedByEmail;
  this.priceChange = priceChange;
  this.resolvedAt = new Date();
  this.actualResolution = new Date();
  return this.save();
};

// Static method to find requests by status
EditRequestSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find urgent requests
EditRequestSchema.statics.findUrgent = function () {
  return this.find({
    $or: [{ priority: "urgent" }, { isUrgent: true }],
    status: { $nin: ["completed", "rejected", "cancelled"] },
  }).sort({ createdAt: -1 });
};

// Static method to find family-related requests
EditRequestSchema.statics.findFamilyRequests = function () {
  return this.find({
    $or: [
      { isFamilyRelated: true },
      { requestType: "child_amenities" },
      { "originalTripDetails.passengers.children": { $gt: 0 } },
      { "originalTripDetails.passengers.infants": { $gt: 0 } },
    ],
  }).sort({ createdAt: -1 });
};

// Static method to get analytics
EditRequestSchema.statics.getAnalytics = function (startDate, endDate) {
  const match = {};
  if (startDate && endDate) {
    match.createdAt = { $gte: startDate, $lte: endDate };
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        averageResolutionTime: { $avg: "$resolutionTimeHours" },
        byStatus: {
          $push: {
            status: "$status",
            requestType: "$requestType",
            priority: "$priority",
          },
        },
      },
    },
  ]);
};

export default mongoose.models.EditRequest ||
  mongoose.model("EditRequest", EditRequestSchema);
