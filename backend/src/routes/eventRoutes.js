import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createEvent,
  getAllEvents,
  registerForEvent,
  updateRegistrationStatus,
  getApprovedEventsForStudent,
  deleteEvent,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// ✅ Routes
router.post("/", protect, createEvent);
router.get("/", getAllEvents);
router.post("/:id/register", protect, registerForEvent);
router.put("/update-status", protect, updateRegistrationStatus);
router.get("/approved/student", protect, getApprovedEventsForStudent);
router.delete("/:id", protect, deleteEvent);
router.put("/:id", protect, updateEvent);

export default router;
