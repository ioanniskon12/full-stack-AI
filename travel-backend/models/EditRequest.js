// models/EditRequest.js - Enhanced with better tracking and family features
import mongoose from "mongoose";

const EditRequestSchema = new mongoose.Schema(
  {
    // References
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    bookingId: String, // Backup string ID for easier querying
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: String, // For easier queries and communication

    // Request Details
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
        "accessibility", // New: Accessibility requests
        "other",
      ],
      required: true,
    },
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
      startDate: Date,
      endDate: Date,
      hotel: String,
      activities: String,
      passengers: {
        adults: Number,
        children: Number,
        infants: Number,
      },
      budget: Number,
      destination: String,
      flightPreferences: {
        class: String,
        seatPreference: String,
        specialRequests: [String],
      },
      childSpecificRequests: {
        carSeat: { type: Boolean, default: false },
        stroller: { type: Boolean, default: false },
        babyCot: { type: Boolean, default: false },
        specialMeals: [String],
        additionalAmenities: [String],
      },
      specialRequests: String,
    },

    // Current Trip Details (snapshot at time of request)
    originalTripDetails: {
      destination: String,
      startDate: Date,
      endDate: Date,
      hotel: String,
      totalPrice: Number,
      passengers: {
        adults: Number,
        children: Number,
        infants: Number,
      },
      selectedActivities: [
        {
          name: String,
          price: Number,
          childFriendly: Boolean,
        },
      ],
      isChildFriendly: Boolean,
    },

    // Enhanced Admin Response
    adminResponse: {
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: Date,
      message: String,
      approvedChanges: Object,
      alternativeOptions: [
        {
          description: String,
          priceChange: Number,
          benefits: [String],
        },
      ],
      estimatedProcessingTime: String,
      nextSteps: [String],
    },

    // Communication History
    communications: [
      {
        type: {
          type: String,
          enum: ["email", "phone", "chat", "internal_note"],
          default: "email",
        },
        from: String, // email or staff name
        to: String,
        subject: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        isInternal: { type: Boolean, default: false },
        attachments: [
          {
            filename: String,
            url: String,
            size: Number,
          },
        ],
      },
    ],

    // Internal Notes for Staff
    internalNotes: [
      {
        note: String,
        addedBy: String,
        addedAt: { type: Date, default: Date.now },
        isImportant: { type: Boolean, default: false },
      },
    ],

    // Financial Impact
    priceChange: { type: Number, default: 0 }, // Positive = additional cost, Negative = refund
    refundAmount: { type: Number, default: 0 },
    additionalFees: { type: Number, default: 0 },
    processingFee: { type: Number, default: 0 },

    // Resolution Details
    resolution: {
      type: String,
      maxlength: 1000,
    },
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

    // File Attachments
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: String,
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
          this.originalTripDetails?.passengers?.infants > 0 ||
          this.originalTripDetails?.isChildFriendly
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
    isWeatherRelated: {
      type: Boolean,
      default: function () {
        return (
          this.requestType === "weather_concern" ||
          this.description?.toLowerCase().includes("weather") ||
          this.description?.toLowerCase().includes("rain") ||
          this.description?.toLowerCase().includes("storm")
        );
      },
    },

    // Deadlines and Timeline
    requestedBy: Date, // Customer's desired resolution date
    estimatedResolution: Date,
    actualResolution: Date,
    escalatedAt: Date,

    // Staff Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedToEmail: String,
    assignedToName: String,
    assignedAt: Date,

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedByEmail: String,
    resolvedByName: String,

    // Escalation
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    escalationReason: String,

    // Customer Feedback
    customerFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date,
    },

    // Integration Data
    externalTicketId: String, // For third-party ticket systems
    stripeRefundId: String, // For Stripe refunds
    supplierReference: String, // Hotel/airline confirmation numbers

    // Auto-categorization
    category: {
      type: String,
      enum: [
        "simple",
        "complex",
        "financial",
        "urgent",
        "family",
        "weather",
        "accessibility",
      ],
      default: function () {
        if (this.priority === "urgent") return "urgent";
        if (this.isFamilyRelated) return "family";
        if (this.isWeatherRelated) return "weather";
        if (this.requestType === "accessibility") return "accessibility";
        if (["cancellation", "refund"].includes(this.requestType))
          return "financial";
        if (["destination_change", "date_change"].includes(this.requestType))
          return "complex";
        return "simple";
      },
    },

    // SLA Tracking
    sla: {
      responseTime: { type: Number }, // Hours to first response
      resolutionTime: { type: Number }, // Hours to resolution
      isOverdue: { type: Boolean, default: false },
      escalationTrigger: Date,
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
    acknowledgedAt: Date,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Enhanced Indexes
EditRequestSchema.index({ booking: 1 });
EditRequestSchema.index({ user: 1, createdAt: -1 });
EditRequestSchema.index({ userEmail: 1 });
EditRequestSchema.index({ status: 1, priority: 1 });
EditRequestSchema.index({ requestType: 1 });
EditRequestSchema.index({ assignedTo: 1, status: 1 });
EditRequestSchema.index({ category: 1 });
EditRequestSchema.index({ isFamilyRelated: 1 });
EditRequestSchema.index({ createdAt: -1 });

// Update timestamps and auto-calculations on save
EditRequestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Auto-set resolved timestamp when status changes to completed/rejected/cancelled
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

  // Calculate SLA metrics
  if (this.acknowledgedAt && !this.sla?.responseTime) {
    this.sla = this.sla || {};
    this.sla.responseTime =
      Math.round(
        ((this.acknowledgedAt - this.createdAt) / (1000 * 60 * 60)) * 10
      ) / 10;
  }

  if (this.resolvedAt && !this.sla?.resolutionTime) {
    this.sla = this.sla || {};
    this.sla.resolutionTime =
      Math.round(((this.resolvedAt - this.createdAt) / (1000 * 60 * 60)) * 10) /
      10;
  }

  // Check if overdue
  if (
    this.estimatedResolution &&
    !this.resolvedAt &&
    new Date() > this.estimatedResolution
  ) {
    this.sla = this.sla || {};
    this.sla.isOverdue = true;
  }

  next();
});

// Virtuals
EditRequestSchema.virtual("responseTimeHours").get(function () {
  if (!this.acknowledgedAt) return null;
  return (
    Math.round(
      ((this.acknowledgedAt - this.createdAt) / (1000 * 60 * 60)) * 10
    ) / 10
  );
});

EditRequestSchema.virtual("resolutionTimeHours").get(function () {
  if (!this.resolvedAt) return null;
  return (
    Math.round(((this.resolvedAt - this.createdAt) / (1000 * 60 * 60)) * 10) /
    10
  );
});

EditRequestSchema.virtual("isOverdue").get(function () {
  if (this.resolvedAt || !this.estimatedResolution) return false;
  return new Date() > this.estimatedResolution;
});

EditRequestSchema.virtual("formattedCreatedAt").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Instance Methods
EditRequestSchema.methods.addCommunication = function (
  type,
  from,
  to,
  subject,
  message,
  isInternal = false,
  attachments = []
) {
  this.communications.push({
    type,
    from,
    to,
    subject,
    message,
    isInternal,
    attachments,
    timestamp: new Date(),
  });
  return this.save();
};

EditRequestSchema.methods.addInternalNote = function (
  note,
  addedBy,
  isImportant = false
) {
  this.internalNotes.push({
    note,
    addedBy,
    isImportant,
    addedAt: new Date(),
  });
  return this.save();
};

EditRequestSchema.methods.assignTo = function (userId, userEmail, userName) {
  this.assignedTo = userId;
  this.assignedToEmail = userEmail;
  this.assignedToName = userName;
  this.assignedAt = new Date();

  if (this.status === "pending") {
    this.status = "acknowledged";
  }
  return this.save();
};

EditRequestSchema.methods.escalate = function (escalatedTo, reason) {
  this.escalatedTo = escalatedTo;
  this.escalationReason = reason;
  this.escalatedAt = new Date();
  this.priority = "urgent";
  return this.save();
};

EditRequestSchema.methods.resolve = function (
  resolution,
  resolutionType,
  resolvedBy,
  resolvedByEmail,
  resolvedByName,
  priceChange = 0
) {
  this.status = "completed";
  this.resolution = resolution;
  this.resolutionType = resolutionType;
  this.resolvedBy = resolvedBy;
  this.resolvedByEmail = resolvedByEmail;
  this.resolvedByName = resolvedByName;
  this.priceChange = priceChange;
  this.resolvedAt = new Date();
  this.actualResolution = new Date();
  return this.save();
};

EditRequestSchema.methods.addCustomerFeedback = function (rating, comment) {
  this.customerFeedback = {
    rating,
    comment,
    submittedAt: new Date(),
  };
  return this.save();
};

// Static Methods
EditRequestSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

EditRequestSchema.statics.findUrgent = function () {
  return this.find({
    $or: [
      { priority: "urgent" },
      { isUrgent: true },
      { "sla.isOverdue": true },
    ],
    status: { $nin: ["completed", "rejected", "cancelled"] },
  }).sort({ createdAt: -1 });
};

EditRequestSchema.statics.findFamilyRequests = function () {
  return this.find({
    $or: [
      { isFamilyRelated: true },
      { requestType: "child_amenities" },
      { "originalTripDetails.passengers.children": { $gt: 0 } },
      { "originalTripDetails.passengers.infants": { $gt: 0 } },
      { "originalTripDetails.isChildFriendly": true },
    ],
  }).sort({ createdAt: -1 });
};

EditRequestSchema.statics.findByCategory = function (category) {
  return this.find({ category }).sort({ createdAt: -1 });
};

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
        averageResponseTime: { $avg: "$sla.responseTime" },
        averageResolutionTime: { $avg: "$sla.resolutionTime" },
        overdueCount: { $sum: { $cond: ["$sla.isOverdue", 1, 0] } },
        familyRequests: { $sum: { $cond: ["$isFamilyRelated", 1, 0] } },
        urgentRequests: {
          $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] },
        },
        byStatus: {
          $push: {
            status: "$status",
            requestType: "$requestType",
            priority: "$priority",
            category: "$category",
          },
        },
      },
    },
  ]);
};

EditRequestSchema.statics.getSLAReport = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgResponseTime: { $avg: "$sla.responseTime" },
        avgResolutionTime: { $avg: "$sla.resolutionTime" },
        overdueCount: { $sum: { $cond: ["$sla.isOverdue", 1, 0] } },
      },
    },
  ]);
};

export default mongoose.models.EditRequest ||
  mongoose.model("EditRequest", EditRequestSchema);

// new done
