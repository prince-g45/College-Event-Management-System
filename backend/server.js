// =========================================
// 🌐 CEPS Backend — Stable Production Build
// =========================================

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";

// =========================================
// 🧩 Initialize Environment Variables
// =========================================
dotenv.config();

// Initialize Express App
const app = express();

// =========================================
// 🧩 Connect MongoDB
// =========================================
connectDB();

// =========================================
// 🔧 Middleware
// =========================================
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Your React frontend (Vite)
    credentials: true,
  })
);
app.use(express.json());

// =========================================
// 🌍 Root Route (Health Check)
// =========================================
app.get("/", (req, res) => {
  res.send("✅ CEPS Backend Running Successfully 🚀");
});

// =========================================
// 📦 Import Routes (All Modules)
// =========================================
import authRoutes from "./src/routes/authRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import trainerRoutes from "./src/routes/trainerRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js"; // ✅ Newly added import

// =========================================
// 🚏 Mount Routes
// =========================================
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/trainers", trainerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ Added notification API

// =========================================
// ⚙️ Global Error Handling Middleware
// =========================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack || err);
  res.status(500).json({
    success: false,
    message: "⚠️ Internal Server Error. Please try again later.",
    error: err.message || err,
  });
});

// =========================================
// 🚀 Start Server
// =========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("========================================");
  console.log(`🚀 CEPS Backend Server running on port ${PORT}`);
  console.log("✅ MongoDB Connection: Successful");
  console.log("========================================");
});
