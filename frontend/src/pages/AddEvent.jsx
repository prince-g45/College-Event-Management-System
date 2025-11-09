// ===========================================
// ✅ CEPS Frontend — Add Event Page (Faculty/Admin Only)
// ===========================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, FileText, Plus } from "lucide-react";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    status: "upcoming",
  });
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Safely extract user ID (handles all possible formats)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const createdBy =
    storedUser?._id ||
    storedUser?.id ||
    localStorage.getItem("userId") ||
    null;

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.venue
    ) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    if (!createdBy) {
      alert("❌ Unable to identify user. Please re-login.");
      return;
    }

    setIsLoading(true);

    // ✅ Log payload for debugging
    console.log("📤 Sending Event Payload:", {
      ...formData,
      createdBy,
    });

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          createdBy,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Event created successfully!");
        setFormData({
          title: "",
          description: "",
          date: "",
          venue: "",
          status: "upcoming",
        });
      } else {
        alert(`⚠️ ${data.message || "Failed to create event"}`);
      }
    } catch (error) {
      console.error("❌ Error creating event:", error);
      alert("Server error while creating event.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
      >
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 text-blue-400">
          <Plus /> Add New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Title */}
          <div>
            <label className="block text-gray-300 mb-2">Event Title</label>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <FileText size={18} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white"
                placeholder="Enter event title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-white/10 p-3 rounded-lg text-white outline-none"
              rows="3"
              placeholder="Enter event details"
            ></textarea>
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-300 mb-2">Date</label>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Calendar size={18} />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-gray-300 mb-2">Venue</label>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <MapPin size={18} />
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white"
                placeholder="Enter venue name"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-gray-300 mb-2">Event Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20"
            >
              <option value="upcoming" className="text-black">
                Upcoming
              </option>
              <option value="ongoing" className="text-black">
                Ongoing
              </option>
              <option value="completed" className="text-black">
                Completed
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white text-lg font-medium transition-all ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isLoading ? "Creating..." : "Add Event"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddEvent;
