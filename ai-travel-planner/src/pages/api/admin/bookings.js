// pages/api/admin/bookings.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import Booking from "@/oldFile/models/Booking";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  await dbConnect();

  if (req.method === "GET") {
    try {
      const bookings = await Booking.find({}).sort("-createdAt");
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
