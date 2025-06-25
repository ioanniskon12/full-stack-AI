// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookingsRoute from "./routes/bookings.js";
import wishlistRoute from "./routes/wishlist.js";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// JSON body parsing
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📨 ${new Date().toISOString()}`);
  console.log(`   ${req.method} ${req.url}`);
  console.log(`   Query:`, req.query);
  console.log(`   Body:`, req.body);
  next();
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!", timestamp: new Date() });
});

// Routes
app.use("/api/bookings", bookingsRoute);
app.use("/api/wishlist", wishlistRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`📍 Test the API at: http://localhost:${PORT}/api/test`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });
