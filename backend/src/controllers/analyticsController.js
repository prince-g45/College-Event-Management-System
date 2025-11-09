// src/controllers/analyticsController.js
const Event = require("../models/Event");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Feedback = require("../models/Feedback");

exports.getOverview = async (req, res) => {
  try {
    // total counts
    const totalEvents = await Event.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalTrainers = await Trainer.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();

    // example: approved registrations count across all events
    const events = await Event.find({}, "registeredUsers");
    let approvedRegistrations = 0;
    let pendingRegistrations = 0;
    events.forEach((ev) => {
      if (Array.isArray(ev.registeredUsers)) {
        ev.registeredUsers.forEach((ru) => {
          if (ru.status === "approved") approvedRegistrations++;
          else if (ru.status === "pending") pendingRegistrations++;
        });
      }
    });

    // basic averages
    const avgFeedbackRating = await Feedback.aggregate([
      { $match: { rating: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);
    const avgRating = avgFeedbackRating.length ? avgFeedbackRating[0].avgRating : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        totalStudents,
        totalFaculty,
        totalTrainers,
        totalFeedbacks,
        approvedRegistrations,
        pendingRegistrations,
        avgRating: Number(avgRating.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    res.status(500).json({ success: false, message: "Error fetching analytics", error: error.message });
  }
};
