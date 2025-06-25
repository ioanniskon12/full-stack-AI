// lib/db-helpers.js
import dbConnect from "./mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";

// User Helpers
export async function createUser(userData) {
  await dbConnect();
  return await User.create(userData);
}

export async function findUserByEmail(email) {
  await dbConnect();
  return await User.findOne({ email: email.toLowerCase() });
}

export async function updateUser(userId, updates) {
  await dbConnect();
  return await User.findByIdAndUpdate(
    userId,
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
}

export async function deleteUser(userId) {
  await dbConnect();
  // Also delete user's bookings
  await Booking.deleteMany({ user: userId });
  return await User.findByIdAndDelete(userId);
}

// Booking Helpers
export async function createBooking(bookingData) {
  await dbConnect();

  // Generate unique trip ID
  const tripId = `TRIP-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;

  return await Booking.create({
    ...bookingData,
    tripId,
    status: "pending",
  });
}

export async function findBookingsByUser(userId) {
  await dbConnect();
  return await Booking.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
}

export async function updateBooking(bookingId, updates) {
  await dbConnect();

  // Track modifications
  const modification = {
    modifiedAt: new Date(),
    changes: updates,
    reason: updates.reason || "Updated by system",
  };

  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      ...updates,
      $push: { modifications: modification },
      updatedAt: new Date(),
    },
    { new: true }
  );
}

export async function cancelBooking(bookingId, userId, reason) {
  await dbConnect();

  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: "cancelled",
      "cancellation.cancelledAt": new Date(),
      "cancellation.cancelledBy": userId,
      "cancellation.reason": reason,
      updatedAt: new Date(),
    },
    { new: true }
  );
}

// Trip Helpers
export async function findPopularTrips(limit = 10) {
  await dbConnect();
  return await Trip.find({ popularityScore: { $gte: 80 } })
    .sort({ popularityScore: -1 })
    .limit(limit);
}

export async function searchTrips(query) {
  await dbConnect();
  return await Trip.find({
    $or: [
      { destination: new RegExp(query, "i") },
      { country: new RegExp(query, "i") },
      { tags: { $in: [new RegExp(query, "i")] } },
    ],
  });
}

// Analytics Helpers
export async function getUserStats() {
  await dbConnect();

  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ emailVerified: true });
  const adminUsers = await User.countDocuments({ role: "admin" });
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: thisMonth },
  });

  return {
    total: totalUsers,
    verified: verifiedUsers,
    admins: adminUsers,
    newThisMonth: newUsersThisMonth,
  };
}

export async function getBookingStats() {
  await dbConnect();

  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: "pending" });
  const confirmedBookings = await Booking.countDocuments({
    status: "confirmed",
  });
  const completedBookings = await Booking.countDocuments({
    status: "completed",
  });
  const cancelledBookings = await Booking.countDocuments({
    status: "cancelled",
  });

  // Calculate revenue
  const bookings = await Booking.find({
    status: { $in: ["confirmed", "completed"] },
  });
  const totalRevenue = bookings.reduce((sum, booking) => {
    return sum + (booking.pricing?.totalPrice || 0);
  }, 0);

  return {
    total: totalBookings,
    pending: pendingBookings,
    confirmed: confirmedBookings,
    completed: completedBookings,
    cancelled: cancelledBookings,
    revenue: totalRevenue,
  };
}

// Validation Helpers
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function sanitizeUser(user) {
  const { password, passwordResetToken, emailVerificationToken, ...sanitized } =
    user.toObject();
  return sanitized;
}
