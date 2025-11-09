import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
  {
    // 👤 Trainer Name
    name: {
      type: String,
      required: [true, "Trainer name is required"],
      trim: true,
    },

    // 🎓 Area of Expertise
    expertise: {
      type: String,
      required: [true, "Expertise is required"],
      trim: true,
    },

    // 📧 Email
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    // 🏫 Linked Event (optional)
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },

    // 🏢 Room or Lab
    room: {
      type: String,
      default: "",
      trim: true,
    },

    // 📅 Scheduled Date
    date: {
      type: String,
      default: "",
    },

    // ⏰ Scheduled Time
    time: {
      type: String,
      default: "",
    },

    // 👨‍🏫 Created By (faculty/admin user)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user reference is required"],
    },

    // ⭐ (Future Extension) Trainer Ratings
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", TrainerSchema);
