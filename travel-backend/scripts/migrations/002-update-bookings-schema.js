// scripts/migrations/002-update-bookings-schema.js
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Running migration: Update bookings schema...");

    const Booking = mongoose.connection.collection("bookings");

    // Generate unique trip IDs for existing bookings
    const bookings = await Booking.find({
      tripId: { $exists: false },
    }).toArray();

    for (const booking of bookings) {
      const tripId = `TRIP-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      await Booking.updateOne(
        { _id: booking._id },
        {
          $set: {
            tripId: tripId,
            status: "confirmed",
            pricing: {
              basePrice: 0,
              flightPrice: 0,
              hotelPrice: 0,
              activitiesPrice: 0,
              taxes: 0,
              fees: 0,
              discount: 0,
              totalPrice: parseInt(
                booking.price?.replace(/[^0-9]/g, "") || "0"
              ),
              currency: "USD",
            },
            payment: {
              method: "card",
              status: "completed",
            },
          },
        }
      );
    }

    console.log(`✅ Updated ${bookings.length} bookings`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
