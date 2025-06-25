// backend/routes/bookings.js - Enhanced with all new features
import express from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`🎯 Bookings route hit: ${req.method} ${req.originalUrl}`);
  next();
});

// GET /api/bookings - Enhanced with filters and population
router.get("/", async (req, res) => {
  console.log("📌 GET /api/bookings handler started");

  try {
    const {
      email,
      status,
      familyTrips,
      destination,
      startDate,
      endDate,
      limit = 50,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (email) {
      filter.email = email;
      console.log("📧 Filtering by email:", email);
    }

    if (status) {
      filter.status = status;
      console.log("📊 Filtering by status:", status);
    }

    if (destination) {
      filter.destination = new RegExp(destination, "i");
      console.log("🌍 Filtering by destination:", destination);
    }

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
      console.log("📅 Filtering by date range");
    }

    // Family trips filter
    if (familyTrips === "true") {
      filter.$or = [
        { "passengers.children": { $gt: 0 } },
        { "passengers.infants": { $gt: 0 } },
        { "familyFeatures.isChildFriendly": true },
      ];
      console.log("👨‍👩‍👧‍👦 Filtering for family trips");
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with population
    const bookings = await Booking.find(filter)
      .populate("user", "name email image")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean for better performance

    // Get total count for pagination
    const totalCount = await Booking.countDocuments(filter);

    console.log(`✅ Found ${bookings.length} bookings (${totalCount} total)`);

    // Add computed fields
    const enhancedBookings = bookings.map((booking) => ({
      ...booking,
      isFamilyTrip:
        booking.passengers?.children > 0 || booking.passengers?.infants > 0,
      totalPassengers:
        (booking.passengers?.adults || 0) +
        (booking.passengers?.children || 0) +
        (booking.passengers?.infants || 0),
      formattedDateRange:
        booking.startDate && booking.endDate
          ? `${booking.startDate.toLocaleDateString()} - ${booking.endDate.toLocaleDateString()}`
          : "TBD",
    }));

    res.json({
      bookings: enhancedBookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + bookings.length < totalCount,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (err) {
    console.error("❌ GET bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings: " + err.message });
  }
});

// GET /api/bookings/:id - Get single booking with full details
router.get("/:id", async (req, res) => {
  console.log("📌 GET single booking handler started");

  try {
    const { id } = req.params;
    const { email } = req.query;

    const booking = await Booking.findById(id)
      .populate("user", "name email image phone")
      .lean();

    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check access permissions
    if (email && booking.email !== email) {
      console.log("❌ Access denied");
      return res.status(403).json({ error: "Access denied" });
    }

    // Add computed fields
    const enhancedBooking = {
      ...booking,
      isFamilyTrip:
        booking.passengers?.children > 0 || booking.passengers?.infants > 0,
      totalPassengers:
        (booking.passengers?.adults || 0) +
        (booking.passengers?.children || 0) +
        (booking.passengers?.infants || 0),
      childFriendlyActivities:
        booking.selectedActivities?.filter(
          (activity) => activity.childFriendly
        ) || [],
    };

    console.log("✅ Booking found and enhanced");
    res.json(enhancedBooking);
  } catch (err) {
    console.error("❌ GET single booking error:", err);
    res.status(500).json({ error: "Failed to fetch booking: " + err.message });
  }
});

// POST /api/bookings - Enhanced booking creation
router.post("/", async (req, res) => {
  console.log("📌 POST /api/bookings handler started");

  try {
    const {
      email,
      // Basic trip info (backwards compatibility)
      Destination,
      Month,
      Reason,
      Duration,
      StartDate,
      EndDate,
      Flight,
      Hotel,
      Activities,
      Price,

      // Enhanced trip info
      destination,
      month,
      reason,
      duration,
      startDate,
      endDate,
      flight,
      hotel,
      activities,
      selectedActivities,
      price,
      basePrice,

      // New fields
      passengers,
      baggage,
      weather,
      originalSearchQuery,
      searchData,
      familyFeatures,
      refinementHistory,
      destinationImage,

      // User reference
      userId,
    } = req.body;

    console.log("📧 Email:", email);
    console.log("🌍 Destination:", destination || Destination);

    // Validation
    if (!email || !(destination || Destination) || !(price || Price)) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        error:
          "Missing required fields: email, destination, and price are required",
      });
    }

    // Find or create user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      console.log("⚠️ User not found, creating new user");
      // Create basic user record
      user = await User.create({
        email,
        name: email.split("@")[0], // Use email prefix as name
        role: "user",
      });
    }

    // Generate unique trip ID
    const tripId = `trip_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Determine if this is a family trip
    const hasChildren = passengers?.children > 0 || passengers?.infants > 0;

    // Create enhanced booking object
    const bookingData = {
      user: user._id,
      email,
      tripId,

      // Trip details (use new format or fallback to old)
      destination: destination || Destination,
      destinationImage:
        destinationImage ||
        `https://source.unsplash.com/1200x600/?${
          (destination || Destination).split(",")[0]
        },travel`,
      month: month || Month,
      reason: reason || Reason,
      duration: duration || Duration,
      startDate: startDate
        ? new Date(startDate)
        : StartDate
        ? new Date(StartDate)
        : null,
      endDate: endDate ? new Date(endDate) : EndDate ? new Date(EndDate) : null,

      // Passenger information
      passengers: passengers || {
        adults: 1,
        children: 0,
        infants: 0,
      },

      // Baggage information
      baggage: baggage || {
        cabin: 0,
        checked: 0,
      },

      // Search context
      originalSearchQuery,
      searchData: searchData || {
        query: originalSearchQuery,
        passengers: passengers,
        baggage: baggage,
        searchTimestamp: new Date(),
      },

      // Weather information
      weather: weather || null,

      // Flight information (enhanced)
      flight: {
        outbound: {
          ...(flight?.outbound || {}),
          airline: flight?.outbound?.airline || "DreamLine Airways",
          flightNumber:
            flight?.outbound?.flightNumber ||
            `DL${Math.floor(Math.random() * 9000) + 1000}`,
          departure: "Your Location",
          arrival: destination || Destination,
          class: flight?.outbound?.class || "Economy",
          gate:
            flight?.outbound?.gate || `B${Math.floor(Math.random() * 20) + 1}`,
          terminal: flight?.outbound?.terminal || "2",
          airportCodes: {
            departure: "XXX",
            arrival: getAirportCode(destination || Destination),
          },
        },
        return: {
          ...(flight?.return || {}),
          airline: flight?.return?.airline || "DreamLine Airways",
          flightNumber:
            flight?.return?.flightNumber ||
            `DL${Math.floor(Math.random() * 9000) + 1000}`,
          departure: destination || Destination,
          arrival: "Your Location",
          class: flight?.return?.class || "Economy",
          gate:
            flight?.return?.gate || `A${Math.floor(Math.random() * 20) + 1}`,
          terminal: flight?.return?.terminal || "1",
          airportCodes: {
            departure: getAirportCode(destination || Destination),
            arrival: "XXX",
          },
        },
        price:
          flight?.price ||
          Math.floor((basePrice || parseInt(price || Price, 10)) * 0.6),
        bookingReference: `${tripId.toUpperCase().substr(0, 6)}`,
      },

      // Hotel information (enhanced)
      hotel: {
        name: hotel?.name || hotel || Hotel,
        rating: hotel?.rating || 5,
        image:
          hotel?.image ||
          `https://source.unsplash.com/800x400/?hotel,luxury,${
            (destination || Destination).split(",")[0]
          }`,
        amenities: hotel?.amenities || [
          "Free WiFi",
          "Pool",
          "Gym",
          "Breakfast",
          "Parking",
          "Spa",
          "Restaurant",
          "24/7 Service",
        ],
        familyAmenities: hasChildren
          ? [
              {
                name: "Baby changing facilities",
                available: true,
                description: "Available in all public restrooms",
              },
              {
                name: "High chairs",
                available: true,
                description: "Available in restaurant",
              },
              {
                name: "Kids menu",
                available: true,
                description: "Child-friendly dining options",
              },
              {
                name: "Babysitting services",
                available: true,
                description: "Professional childcare available",
              },
            ]
          : [],
        confirmationNumber: `HTL${tripId.substr(-6).toUpperCase()}`,
      },

      // Activities (enhanced)
      activities: activities || Activities || [],
      selectedActivities: selectedActivities || [],

      // Family features
      familyFeatures: {
        isChildFriendly: hasChildren,
        childFriendlyAmenities: hasChildren
          ? [
              "Baby changing facilities",
              "High chairs available",
              "Kids menu at restaurants",
              "Stroller-friendly paths",
              "Child safety locks",
              "Babysitting services",
            ]
          : [],
        childrenAges:
          passengers?.children > 0
            ? Array.from(
                { length: passengers.children },
                (_, i) => Math.floor(Math.random() * 10) + 3
              )
            : [],
      },

      // Pricing (enhanced)
      pricing: {
        basePrice: basePrice || parseInt(price || Price, 10),
        flightPrice: Math.floor(
          (basePrice || parseInt(price || Price, 10)) * 0.6
        ),
        hotelPrice: Math.floor(
          (basePrice || parseInt(price || Price, 10)) * 0.3
        ),
        activitiesPrice:
          selectedActivities?.reduce(
            (sum, activity) => sum + (activity.price || 0),
            0
          ) || 0,
        totalPrice: parseInt(price || Price, 10),
        currency: "USD",
        paidAmount: 0,
      },

      // Payment information
      payment: {
        method: "card",
        status: "pending",
      },

      // Refinement history
      refinementHistory: refinementHistory || [],

      // Status
      status: "confirmed",
      bookedAt: new Date(),
    };

    // Create the booking
    console.log("💾 Creating booking...");
    const booking = await Booking.create(bookingData);

    // Update user travel stats
    if (user) {
      await user.updateTravelStats({
        totalPrice: booking.pricing.totalPrice,
        endDate: booking.endDate,
        destination: booking.destination,
      });
      console.log("📊 Updated user travel stats");
    }

    console.log("✅ Booking created:", booking._id);

    // Populate user info for response
    await booking.populate("user", "name email image");

    res.status(201).json({
      success: true,
      booking,
      message: hasChildren
        ? "Family trip booked successfully!"
        : "Trip booked successfully!",
    });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    res.status(500).json({
      error: "Failed to create booking: " + err.message,
    });
  }
});

// PUT /api/bookings/:id - Update booking
router.put("/:id", async (req, res) => {
  console.log("📌 PUT /api/bookings handler started");

  try {
    const { id } = req.params;
    const { email } = req.query;
    const updates = req.body;

    // Find existing booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check permissions
    if (email && booking.email !== email) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Track modifications
    if (Object.keys(updates).length > 0) {
      booking.modifications.push({
        modifiedAt: new Date(),
        modifiedBy: booking.user,
        modificationType: "user_request",
        changes: updates,
        reason: updates.reason || "User requested changes",
      });
    }

    // Apply updates
    Object.assign(booking, updates);
    booking.updatedAt = new Date();

    await booking.save();

    console.log("✅ Booking updated");
    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ Booking update error:", err);
    res.status(500).json({ error: "Failed to update booking: " + err.message });
  }
});

// POST /api/bookings/:id/refine - Add refinement to booking
router.post("/:id/refine", async (req, res) => {
  console.log("📌 POST refinement handler started");

  try {
    const { id } = req.params;
    const { refinementPrompt, changesRequested } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Add refinement to history
    await booking.addRefinement(refinementPrompt, changesRequested);

    console.log("✅ Refinement added to booking");
    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ Refinement error:", err);
    res.status(500).json({ error: "Failed to add refinement: " + err.message });
  }
});

// GET /api/bookings/stats/:email - Get user booking statistics
router.get("/stats/:email", async (req, res) => {
  console.log("📌 GET booking stats handler started");

  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const stats = await Booking.getBookingStats(user._id);

    // Additional stats
    const familyBookings = await Booking.findFamilyBookings().countDocuments({
      user: user._id,
    });
    const recentBookings = await Booking.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("destination startDate endDate status");

    res.json({
      ...stats[0],
      familyBookings,
      recentBookings,
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ error: "Failed to get stats: " + err.message });
  }
});

// DELETE /api/bookings/:id - Enhanced deletion with proper cleanup
router.delete("/:id", async (req, res) => {
  console.log("📌 DELETE /api/bookings handler started");

  try {
    const { id } = req.params;
    const { email, reason } = req.query;

    const booking = await Booking.findById(id);
    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check permissions
    if (email && booking.email !== email) {
      console.log("❌ Access denied");
      return res.status(403).json({ error: "Access denied" });
    }

    // Update booking to cancelled status instead of deleting
    booking.status = "cancelled";
    booking.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: booking.user,
      reason: reason || "User requested cancellation",
    };

    await booking.save();

    console.log("✅ Booking cancelled");
    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("❌ DELETE error:", err);
    res.status(500).json({ error: "Failed to cancel booking: " + err.message });
  }
});

// Helper function to get airport code
function getAirportCode(destination) {
  const codes = {
    London: "LHR",
    Paris: "CDG",
    Tokyo: "NRT",
    "New York": "JFK",
    Rome: "FCO",
    Barcelona: "BCN",
    Amsterdam: "AMS",
    Dubai: "DXB",
    Sydney: "SYD",
    "Los Angeles": "LAX",
    Bangkok: "BKK",
    Singapore: "SIN",
  };

  const city = destination.split(",")[0].trim();
  return codes[city] || city.substring(0, 3).toUpperCase();
}

export default router;
