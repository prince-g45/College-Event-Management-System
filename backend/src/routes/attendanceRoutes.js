import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getEventStudents,
  saveAttendance,
  getStudentAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// ✅ Get approved students for event
router.get("/event/:eventId/students", protect, getEventStudents);

// ✅ Save attendance
router.post("/save", protect, saveAttendance);

// ✅ Get attendance for logged-in student
router.get("/student", protect, getStudentAttendance);

export default router;
