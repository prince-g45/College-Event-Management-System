// ===========================================
// ✅ CEPS Backend — Attendance Controller (Final Updated)
// ===========================================

import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

// ✅ Get Registered Students for an Event (Approved Only)
export const getEventStudents = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    // ✅ Filter only approved students
    const approvedStudents = event.registeredUsers.filter(
      (u) => u.status === "approved"
    );

    // ✅ Fetch full student data (with email + name)
    const studentsWithDetails = await Promise.all(
      approvedStudents.map(async (student) => {
        const user = await User.findById(student.userId).select("name email");
        return {
          studentId: student.userId,
          studentName: user?.name || "Unknown Student",
          email: user?.email || "N/A",
        };
      })
    );

    res.status(200).json({ success: true, students: studentsWithDetails });
  } catch (err) {
    console.error("❌ Get Event Students Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Save Attendance (Faculty/Admin)
export const saveAttendance = async (req, res) => {
  try {
    const { eventId, records } = req.body; // [{ studentId, studentName, email, status }]
    const facultyId = req.user?._id || "unknown";

    if (!eventId || !records?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Missing eventId or records" });
    }

    // ✅ Validate records
    const validRecords = records.filter(
      (r) => r.studentId && r.studentName && r.email && r.status
    );

    if (validRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid student records found.",
      });
    }

    console.log("📦 Attendance Data to Save:", validRecords);

    // ✅ Delete old attendance for this event
    await Attendance.deleteMany({ eventId });

    // ✅ Prepare new records
    const bulkData = validRecords.map((rec) => ({
      eventId,
      studentId: rec.studentId,
      studentName: rec.studentName,
      email: rec.email,
      status: rec.status,
      markedBy: facultyId,
      date: new Date(),
    }));

    // ✅ Insert new attendance records
    await Attendance.insertMany(bulkData);

    res.status(200).json({
      success: true,
      message: "✅ Attendance saved successfully with student details!",
    });
  } catch (err) {
    console.error("❌ Save Attendance Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Attendance for a Student (Student View)
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user?._id;

    const attendance = await Attendance.find({ studentId }).populate(
      "eventId",
      "title date venue"
    );

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (err) {
    console.error("❌ Get Student Attendance Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
