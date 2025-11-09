// ===========================================
// ✅ CEPS Backend — Dashboard Controller (Final Updated Version)
// ===========================================

import Event from "../models/Event.js";
import Trainer from "../models/Trainer.js";

// ✅ Get Dashboard Data (Student / Faculty / Admin)
export const getDashboardData = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?._id?.toString();

    // 🧩 Validate User Info
    if (!role || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user data" });
    }

    // 🧩 Fetch all events
    const allEvents = await Event.find().populate(
      "registeredUsers.userId",
      "name email role"
    );

    // 🧩 Fetch total trainers invited (for faculty/admin dashboard)
    const trainersInvited = await Trainer.countDocuments();

    // 🎓 Student Dashboard
    if (role === "student") {
      const myRegisteredEvents = allEvents.filter((event) =>
        event.registeredUsers.some((r) => {
          const id = r.userId?._id?.toString();
          return id && id === userId;
        })
      );

      const myApprovedEvents = allEvents.filter((event) =>
        event.registeredUsers.some((r) => {
          const id = r.userId?._id?.toString();
          return id && id === userId && r.status === "approved";
        })
      );

      return res.status(200).json({
        success: true,
        role,
        totalEvents: allEvents.length,
        activeParticipants: myRegisteredEvents.length,
        approvedRegistrations: myApprovedEvents.length,
        trainersInvited: 0, // Student view doesn’t show trainers
        events: allEvents,
      });
    }

    // 👨‍🏫 Faculty / Admin Dashboard
    const totalEvents = allEvents.length;
    const activeParticipants = allEvents.reduce(
      (acc, e) => acc + e.registeredUsers.length,
      0
    );
    const approvedRegistrations = allEvents.reduce(
      (acc, e) =>
        acc + e.registeredUsers.filter((r) => r.status === "approved").length,
      0
    );

    return res.status(200).json({
      success: true,
      role,
      totalEvents,
      activeParticipants,
      approvedRegistrations,
      trainersInvited, // ✅ Now dynamically fetched from Trainer model
      events: allEvents,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};
