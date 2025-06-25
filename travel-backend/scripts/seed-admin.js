// scripts/seed-admin.js
// Run with: node scripts/seed-admin.js

const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function createAdmin() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log("🔄 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(); // Uses default database from connection string
    const usersCollection = db.collection("users");

    // Admin details
    const adminEmail = "admin@aitravelplanner.com";
    const adminPassword = "Admin123!"; // CHANGE THIS!
    const adminName = "Admin User";

    // Check if admin exists
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists");

      // Option to update existing admin to have admin role
      if (existingAdmin.role !== "admin") {
        await usersCollection.updateOne(
          { email: adminEmail },
          { $set: { role: "admin" } }
        );
        console.log("✅ Updated existing user to admin role");
      }

      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin
    const admin = {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "admin",
      emailVerified: true,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        adminName
      )}&background=dc2626&color=fff`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(admin);

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("⚠️  IMPORTANT: Change the password after first login!");
  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.error("\n🔴 MongoDB connection refused. Please check:");
      console.error("1. Is MongoDB running?");
      console.error("2. Is your MONGODB_URI correct?");
      console.error("3. If using MongoDB Atlas, check your IP whitelist");
      console.error("4. Check your network connection");
    }
  } finally {
    await client.close();
    process.exit(0);
  }
}

// Also add a function to make any user an admin
async function makeUserAdmin(email) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { email: email },
      { $set: { role: "admin", updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      console.log("❌ User not found:", email);
    } else {
      console.log("✅ User updated to admin:", email);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args[0] === "--make-admin" && args[1]) {
  makeUserAdmin(args[1]);
} else {
  createAdmin();
}
