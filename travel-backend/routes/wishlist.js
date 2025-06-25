// ===== backend/routes/wishlist.js =====
import express from "express";
import WishlistItem from "../models/Wishlist.js";
import User from "../models/User.js";

const router = express.Router();

// Add logging to see if route is hit
router.use((req, res, next) => {
  console.log(`   🎯 Wishlist route hit: ${req.method} ${req.originalUrl}`);
  next();
});

// GET wishlist for a user
router.get("/", async (req, res) => {
  console.log("   📌 GET /api/wishlist handler started");

  try {
    const { userEmail } = req.query;
    console.log("   📧 User email:", userEmail);

    if (!userEmail) {
      console.log("   ❌ No email provided");
      return res.status(400).json({ error: "User email is required" });
    }

    // Find user by email
    console.log("   🔍 Looking for user in database...");
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log("   ⚠️ User not found, returning empty wishlist");
      return res.status(200).json({ items: [] });
    }

    console.log("   ✅ User found:", user._id);

    // Get wishlist items for the user
    const wishlistItems = await WishlistItem.find({ user: user._id }).sort({
      addedAt: -1,
    });

    console.log("   📦 Found", wishlistItems.length, "wishlist items");
    res.status(200).json({ items: wishlistItems });
  } catch (error) {
    console.error("   ❌ Error in GET /api/wishlist:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch wishlist: " + error.message });
  }
});

// POST - Add item to wishlist
router.post("/", async (req, res) => {
  console.log("   📌 POST /api/wishlist handler started");

  try {
    const { userEmail, tripData } = req.body;
    console.log("   📧 User email:", userEmail);
    console.log("   🎫 Trip data:", JSON.stringify(tripData, null, 2));

    if (!userEmail || !tripData) {
      console.log("   ❌ Missing required data");
      return res
        .status(400)
        .json({ error: "User email and trip data are required" });
    }

    // Find user by email
    console.log("   🔍 Looking for user in database...");
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log("   ⚠️ User not found");
      return res
        .status(404)
        .json({ error: "User not found. Please ensure you're logged in." });
    }

    console.log("   ✅ User found:", user._id);

    // Check if item already exists
    const existingItem = await WishlistItem.findOne({
      user: user._id,
      "tripData.destination": tripData.destination,
      "tripData.startDate": tripData.startDate,
    });

    if (existingItem) {
      console.log("   ⚠️ Trip already in wishlist");
      return res.status(400).json({ error: "Trip already in wishlist" });
    }

    // Create new wishlist item
    console.log("   💾 Creating new wishlist item...");
    const newItem = await WishlistItem.create({
      user: user._id,
      tripData: {
        ...tripData,
        startDate: tripData.startDate ? new Date(tripData.startDate) : null,
        endDate: tripData.endDate ? new Date(tripData.endDate) : null,
      },
    });

    console.log("   ✅ Wishlist item created:", newItem._id);
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.error("   ❌ Error in POST /api/wishlist:", error);
    res
      .status(500)
      .json({ error: "Failed to add to wishlist: " + error.message });
  }
});

// DELETE - Remove item from wishlist
router.delete("/:userEmail/:tripId", async (req, res) => {
  console.log("   📌 DELETE /api/wishlist handler started");

  try {
    const { userEmail, tripId } = req.params;
    console.log("   📧 User email:", userEmail);
    console.log("   🆔 Trip ID:", tripId);

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log("   ❌ User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the wishlist item
    const deletedItem = await WishlistItem.findOneAndDelete({
      _id: tripId,
      user: user._id,
    });

    if (!deletedItem) {
      console.log("   ❌ Wishlist item not found");
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    console.log("   ✅ Wishlist item deleted");
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("   ❌ Error in DELETE /api/wishlist:", error);
    res
      .status(500)
      .json({ error: "Failed to remove from wishlist: " + error.message });
  }
});

export default router;
