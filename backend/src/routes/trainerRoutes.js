// ===========================================
// ✅ CEPS Backend — Trainer Routes (Final Secure Version)
// ===========================================

import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createTrainer,
  getAllTrainers,
  updateTrainer,
  deleteTrainer,
} from "../controllers/trainerController.js";

const router = express.Router();

// ===================================================
// ✅ Create Trainer (Faculty/Admin only)
// ===================================================
router.post("/", protect, async (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "faculty" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only faculty or admin can add trainers.",
      });
    }
    await createTrainer(req, res);
  } catch (err) {
    next(err);
  }
});

// ===================================================
// ✅ Get All Trainers (Accessible to all roles)
// ===================================================
router.get("/", protect, getAllTrainers);

// ===================================================
// ✅ Update Trainer (Faculty/Admin only)
// ===================================================
router.put("/:id", protect, async (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "faculty" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only faculty or admin can update trainers.",
      });
    }
    await updateTrainer(req, res);
  } catch (err) {
    next(err);
  }
});

// ===================================================
// ✅ Delete Trainer (Faculty/Admin only)
// ===================================================
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "faculty" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied — only faculty or admin can delete trainers.",
      });
    }
    await deleteTrainer(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
