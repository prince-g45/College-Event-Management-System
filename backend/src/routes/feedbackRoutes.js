// ===========================================
// ✅ CEPS Backend — Feedback Routes (ES6 Final)
// ===========================================

import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addFeedback,
  getFeedbacks,
} from "../controllers/feedbackController.js";

const router = express.Router();

// 📝 Submit Feedback (Student)
router.post("/", protect, addFeedback);

// 📋 Get All Feedback (Faculty/Admin)
router.get("/", protect, getFeedbacks);

export default router;
