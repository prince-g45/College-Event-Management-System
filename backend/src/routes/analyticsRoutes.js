// ===========================================
// ✅ CEPS Backend — Analytics Routes (ES6 Fixed)
// ===========================================

import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📊 Analytics Overview Route
router.get("/overview", protect, async (req, res) => {
  try {
    // Stubbed response (can be replaced with live data later)
    res.json({
      success: true,
      totalEvents: 0,
      upcoming: 0,
      ongoing: 0,
      completed: 0,
    });
  } catch (error) {
    console.error("❌ Analytics Overview Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching analytics overview",
      error: error.message,
    });
  }
});

export default router;
