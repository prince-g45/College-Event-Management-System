// ===========================================
// ✅ CEPS Backend — Event Controller (Final Polished Version)
// ===========================================

import mongoose from "mongoose";
import Event from "../models/Event.js";
import User from "../models/User.js";

// ===================================================
// ✅ Create New Event (Admin / Faculty)
// ===================================================
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, createdBy, status } = req.body;

    // 🧩 Validate input
    if (!title || !description || !date || !venue || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🧩 Validate ObjectId for createdBy
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid creator ID",
      });
    }

    // 🧩 Create new event document
    const event = await Event.create({
      title,
      description,
      date,
      venue,
      status: status?.toLowerCase() || "upcoming", // normalize casing
      createdBy,
    });

    console.log(`✅ New Event Created: ${event.title}`);

    res.status(201).json({
      success: true,
      message: "✅ Event created successfully",
      event,
    });
  } catch (error) {
    console.error("❌ Create Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

// ===================================================
// ✅ Register for an Event (Student)
// ===================================================
// ===================================================
// ✅ Register for an Event (Student)
// ===================================================
export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?._id;
    const userName = req.user?.name || "Student";

    console.log("📩 Registration Request:", { eventId, userId, userName });

    // 🧩 Validate input
    if (!eventId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (eventId or userId)",
      });
    }

    // 🧩 Validate Object IDs
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // 🧩 Check if already registered
    const alreadyRegistered = event.registeredUsers.some(
      (u) => u.userId?.toString() === userId.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this event",
      });
    }

    // 🧩 Register the student
    event.registeredUsers.push({
      userId: new mongoose.Types.ObjectId(userId),
      userName,
      status: "pending",
    });

    await event.save();

    console.log(`✅ ${userName} registered for event ${eventId}`);

    res.status(200).json({
      success: true,
      message: "Registered successfully! Waiting for approval.",
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering for event",
      error: error.message,
    });
  }
};

// ===================================================
// ✅ Approve / Reject Registration (Admin / Faculty)
// ===================================================
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { eventId, userId, status } = req.body;

    // 🧩 Validate input
    if (!eventId || !userId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🧩 Ensure status is valid
    if (!["approved", "rejected", "pending"].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // 🧩 Update registration status
    const event = await Event.findOneAndUpdate(
      { _id: eventId, "registeredUsers.userId": userId },
      { $set: { "registeredUsers.$.status": status.toLowerCase() } },
      { new: true }
    );

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event or user not found" });
    }

    console.log(`✅ Status updated: User ${userId} → ${status}`);

    res.status(200).json({
      success: true,
      message: `Registration ${status.toLowerCase()} successfully`,
      event,
    });
  } catch (error) {
    console.error("❌ Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating registration status",
      error: error.message,
    });
  }
};

// ===================================================
// ✅ Get All Events (Public)
// ===================================================
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name role email")
      .sort({ createdAt: -1 });

    console.log(`📦 ${events.length} events fetched successfully.`);
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("❌ Get Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

// ===================================================
// ✅ Get Approved Events for Logged-in Student
// ===================================================
export const getApprovedEventsForStudent = async (req, res) => {
  try {
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing student ID",
      });
    }

    const approvedEvents = await Event.find({
      "registeredUsers.userId": studentId,
      "registeredUsers.status": "approved",
    }).select("title description date venue status");

    if (!approvedEvents.length) {
      return res.status(200).json({
        success: true,
        events: [],
        message: "No approved events found for this student.",
      });
    }

    res.status(200).json({
      success: true,
      events: approvedEvents,
    });
  } catch (error) {
    console.error("❌ Get Approved Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching approved events",
      error: error.message,
    });
  }
};
// ============================================
// ✅ Delete Event (Faculty/Admin)
// ============================================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Event Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================================
// ✅ Update Event (Faculty/Admin)
// ============================================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedEvent)
      return res.status(404).json({ success: false, message: "Event not found" });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("❌ Update Event Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
