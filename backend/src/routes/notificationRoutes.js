// ===========================================
// ✅ CEPS Backend — Notification Routes
// ===========================================

import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  sendNotification,
  getNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// ✅ Create a new notification (faculty/admin)
router.post("/", protect, sendNotification);

// ✅ Get all notifications (for all roles)
router.get("/", protect, getNotifications);

export default router;
