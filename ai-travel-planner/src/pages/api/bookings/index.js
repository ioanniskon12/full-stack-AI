// pages/api/bookings/index.js - WITH DEBUG LOGGING
import dbConnect from "@/lib/mongodb";
import Booking from "@/oldFile/models/Booking";

export default async function handler(req, res) {
  console.log("🔵 Bookings API called:", req.method);
  console.log("🔵 Request body:", JSON.stringify(req.body, null, 2));

  try {
    await dbConnect();
    console.log("✅ Database connected");
  } catch (dbError) {
    console.error("❌ Database connection failed:", dbError);
    return res.status(500).json({
      error: "Database connection failed",
      details: dbError.message,
    });
  }

  if (req.method === "GET") {
    try {
      const filter = {};
      if (req.query.email) filter.email = req.query.email;
      const bookings = await Booking.find(filter);
      return res.status(200).json(bookings);
    } catch (err) {
      console.error("❌ GET error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const b = req.body;
      console.log("🔵 Creating booking with data:", {
        email: b.email,
        destination: b.Destination,
        price: b.Price,
      });

      const booking = new Booking({
        email: b.email,
        destination: b.Destination,
        month: b.Month,
        reason: b.Reason,
        duration: b.Duration,
        startDate: b.StartDate ? new Date(b.StartDate) : null,
        endDate: b.EndDate ? new Date(b.EndDate) : null,
        flight: {
          outbound: b.Flight?.Outbound || "",
          return: b.Flight?.Return || "",
        },
        hotel: b.Hotel,
        activities: b.Activities || [],
        price: b.Price,
      });

      console.log("🔵 Saving booking to database...");
      await booking.save();
      console.log("✅ Booking saved successfully:", booking._id);

      return res.status(201).json(booking);
    } catch (err) {
      console.error("❌ POST error:", err);
      console.error("❌ Error stack:", err.stack);
      return res.status(500).json({
        error: err.message,
        validationErrors: err.errors, // Mongoose validation errors
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const { email } = req.query;
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ error: "Not found" });
      if (email && booking.email !== email) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await Booking.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("❌ DELETE error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
