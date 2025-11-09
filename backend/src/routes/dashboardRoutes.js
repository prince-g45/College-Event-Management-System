// ===========================================
// ✅ CEPS Backend — Dashboard Routes (ES6 Fixed)
// ===========================================

import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🧠 Secure Dashboard Stats Route (Only Authorized Users)
router.get("/", protect, getDashboardData);

export default router;
