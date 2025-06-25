// scripts/setup-database.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

// Import schemas directly (for setup script)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "user" },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  country: String,
  description: String,
  image: String,
  tags: [String],
  popularityScore: Number,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Trip = mongoose.model("Trip", TripSchema);

async function setupDatabase() {
  try {
    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Create collections with indexes
    console.log("📊 Creating indexes...");

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ createdAt: -1 });

    console.log("✅ Indexes created");

    // Create admin user
    console.log("👤 Creating admin user...");

    const adminEmail = "admin@aitravelplanner.com";
    const adminPassword = "Admin123!"; // CHANGE THIS IN PRODUCTION!

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        emailVerified: true,
      });

      console.log("✅ Admin user created");
      console.log("📧 Email:", adminEmail);
      console.log("🔑 Password:", adminPassword);
      console.log("⚠️  IMPORTANT: Change the password after first login!");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Seed some popular trips
    console.log("🌍 Seeding popular destinations...");

    const popularDestinations = [
      {
        destination: "Paris",
        country: "France",
        description:
          "The City of Light - famous for the Eiffel Tower, Louvre Museum, and romantic atmosphere",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        tags: ["romantic", "culture", "history", "food", "art"],
        popularityScore: 95,
      },
      {
        destination: "Tokyo",
        country: "Japan",
        description:
          "A blend of ancient traditions and cutting-edge technology",
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        tags: ["culture", "technology", "food", "shopping", "temples"],
        popularityScore: 90,
      },
      {
        destination: "Dubai",
        country: "UAE",
        description:
          "Luxury shopping, ultramodern architecture, and desert adventures",
        image:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        tags: ["luxury", "shopping", "desert", "modern", "beach"],
        popularityScore: 85,
      },
      {
        destination: "Barcelona",
        country: "Spain",
        description:
          "Stunning architecture, beautiful beaches, and vibrant nightlife",
        image:
          "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
        tags: ["beach", "architecture", "food", "nightlife", "culture"],
        popularityScore: 88,
      },
      {
        destination: "Rome",
        country: "Italy",
        description:
          "Ancient history, world-class art, and incredible Italian cuisine",
        image:
          "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
        tags: ["history", "art", "food", "culture", "architecture"],
        popularityScore: 92,
      },
    ];

    for (const destination of popularDestinations) {
      const existing = await Trip.findOne({
        destination: destination.destination,
      });
      if (!existing) {
        await Trip.create(destination);
        console.log(`✅ Added ${destination.destination}`);
      }
    }

    console.log("🎉 Database setup completed successfully!");

    // Show database stats
    const userCount = await User.countDocuments();
    const tripCount = await Trip.countDocuments();

    console.log("\n📊 Database Statistics:");
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`✈️  Total Destinations: ${tripCount}`);
  } catch (error) {
    console.error("❌ Error setting up database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the setup
setupDatabase();
