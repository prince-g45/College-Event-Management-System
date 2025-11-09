// ===========================================
// ✅ CEPS Backend — User Controller (ES6 Fixed)
// ===========================================

import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✏️ Update User Details
export const updateUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email, role } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Update User Error:", error);
    res.status(500).json({
      success: false,
      message: "⚠️ Server error while updating profile",
      error: error.message,
    });
  }
};

// 🔒 Change User Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Both old and new passwords are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "✅ Password changed successfully",
    });
  } catch (error) {
    console.error("❌ Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: "⚠️ Server error while changing password",
      error: error.message,
    });
  }
};
