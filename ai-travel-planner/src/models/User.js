// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 6,
    select: false,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
