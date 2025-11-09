import Trainer from "../models/Trainer.js";
import Event from "../models/Event.js";

// ✅ Create Trainer (Faculty/Admin)
export const createTrainer = async (req, res) => {
  try {
    const { name, expertise, email, eventId, room, date, time } = req.body;

    // 🛑 Validate required fields
    if (!name || !expertise || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name, expertise, and email are required." });
    }

    // 🧩 Optional: Verify event exists
    let linkedEvent = null;
    if (eventId) {
      linkedEvent = await Event.findById(eventId);
      if (!linkedEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please select a valid event.",
        });
      }
    }

    // ✅ Create Trainer record
    const trainer = await Trainer.create({
      name,
      expertise,
      email,
      eventId: eventId || null,
      room: room || "",
      date: date || "",
      time: time || "",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer,
    });
  } catch (err) {
    console.error("❌ Create Trainer Error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ Get All Trainers (Visible to All Roles)
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate("eventId", "title date venue")
      .populate("createdBy", "name role email");

    res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (err) {
    console.error("❌ Get Trainers Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch trainers", error: err.message });
  }
};

// ✅ Update Trainer (Faculty/Admin)
export const updateTrainer = async (req, res) => {
  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("eventId", "title venue date")
      .populate("createdBy", "name email");

    if (!updatedTrainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    res.json({
      success: true,
      message: "Trainer updated successfully",
      trainer: updatedTrainer,
    });
  } catch (err) {
    console.error("❌ Update Trainer Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update trainer", error: err.message });
  }
};

// ✅ Delete Trainer (Faculty/Admin)
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    await Trainer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Trainer "${trainer.name}" deleted successfully`,
    });
  } catch (err) {
    console.error("❌ Delete Trainer Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete trainer", error: err.message });
  }
};
