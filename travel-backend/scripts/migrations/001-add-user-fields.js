// scripts/migrations/001-add-user-fields.js
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Running migration: Add user fields...");

    const User = mongoose.connection.collection("users");

    // Add new fields to existing users
    await User.updateMany(
      { phone: { $exists: false } },
      {
        $set: {
          phone: null,
          address: {
            street: null,
            city: null,
            state: null,
            country: null,
            postalCode: null,
          },
          preferences: {
            currency: "USD",
            language: "en",
            newsletter: true,
            notifications: {
              email: true,
              sms: false,
              push: true,
            },
          },
        },
      }
    );

    console.log("✅ Migration completed");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
