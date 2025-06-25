// models/Review.js
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    type: {
      type: String,
      enum: ["trip", "hotel", "activity", "overall"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: String,
    comment: {
      type: String,
      required: true,
    },
    pros: [String],
    cons: [String],
    photos: [String],
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    adminResponse: {
      message: String,
      respondedAt: Date,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
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
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ booking: 1 });
ReviewSchema.index({ type: 1 });
ReviewSchema.index({ rating: -1 });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
