// pages/api/admin/analytics.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import Booking from "@/oldFile/models/Booking";
import User from "@/oldFile/models/User";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  await dbConnect();

  if (req.method === "GET") {
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get user statistics
      const totalUsers = await User.countDocuments();
      const newUsersThisMonth = await User.countDocuments({
        createdAt: { $gte: thisMonth },
      });
      const verifiedUsers = await User.countDocuments({ emailVerified: true });

      // Get booking statistics
      const totalBookings = await Booking.countDocuments();
      const bookingsThisMonth = await Booking.countDocuments({
        createdAt: { $gte: thisMonth },
      });
      const upcomingTrips = await Booking.countDocuments({
        startDate: { $gt: now },
      });

      // Calculate revenue
      const bookings = await Booking.find({});
      const totalRevenue = bookings.reduce((sum, booking) => {
        const price = parseInt(booking.price?.replace(/[^0-9]/g, "") || "0");
        return sum + price;
      }, 0);

      const thisMonthBookings = await Booking.find({
        createdAt: { $gte: thisMonth },
      });
      const monthlyRevenue = thisMonthBookings.reduce((sum, booking) => {
        const price = parseInt(booking.price?.replace(/[^0-9]/g, "") || "0");
        return sum + price;
      }, 0);

      // Get popular destinations
      const destinationCounts = {};
      bookings.forEach((booking) => {
        const dest = booking.destination;
        destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
      });

      const popularDestinations = Object.entries(destinationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([destination, count]) => ({ destination, count }));

      // Monthly bookings trend (last 6 months)
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const count = await Booking.countDocuments({
          createdAt: { $gte: startDate, $lte: endDate },
        });

        monthlyTrend.push({
          month: startDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          bookings: count,
        });
      }

      res.status(200).json({
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          verified: verifiedUsers,
          verificationRate:
            totalUsers > 0
              ? ((verifiedUsers / totalUsers) * 100).toFixed(1)
              : 0,
        },
        bookings: {
          total: totalBookings,
          thisMonth: bookingsThisMonth,
          upcoming: upcomingTrips,
          averagePerUser:
            totalUsers > 0 ? (totalBookings / totalUsers).toFixed(1) : 0,
        },
        revenue: {
          total: totalRevenue,
          thisMonth: monthlyRevenue,
          averagePerBooking:
            totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0,
        },
        popularDestinations,
        monthlyTrend,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
