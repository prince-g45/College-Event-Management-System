import Feedback from "../models/Feedback.js";

// ✅ Add Feedback (Student)
export const addFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body;

    if (!message || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please provide both message and rating",
      });
    }

    // req.user is added by authMiddleware after verifying JWT
    const userId = req.user?._id;

    const feedback = await Feedback.create({
      userId,
      message,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Feedback stored successfully",
      feedback,
    });
  } catch (error) {
    console.error("Add Feedback Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving feedback",
      error: error.message,
    });
  }
};

// ✅ Get All Feedback (Faculty/Admin)
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      all: feedbacks,
    });
  } catch (error) {
    console.error("Get Feedbacks Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching feedbacks",
      error: error.message,
    });
  }
};
