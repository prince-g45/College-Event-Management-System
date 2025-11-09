// ===========================================
// ✅ CEPS Backend — Notification Model
// ===========================================
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    recipients: {
      type: [String], // ["student", "faculty"]
      default: ["student"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
