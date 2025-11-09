// ===========================================
// ✅ CEPS Backend — Notification Controller
// ===========================================

import Notification from "../models/Notification.js";

// ✅ Send Notification (Faculty/Admin)
export const sendNotification = async (req, res) => {
  try {
    const { title, message, recipients } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Title and message are required." });
    }

    const notification = await Notification.create({
      sender: req.user._id,
      title,
      message,
      recipients: recipients?.length ? recipients : ["student"],
    });

    res.status(201).json({
      success: true,
      message: "Notification sent successfully!",
      notification,
    });
  } catch (err) {
    console.error("❌ Notification Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Notifications (All Roles)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("sender", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
