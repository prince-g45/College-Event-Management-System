// ===========================================
// ✅ CEPS Frontend — Trainer & Resource Allocation (Final Optimized)
// ===========================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, UserPlus, Trash2, Edit, Save } from "lucide-react";

const TrainerAllocation = () => {
  const [role, setRole] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    expertise: "",
    email: "",
    eventId: "",
    room: "",
    date: "",
    time: "",
  });
  const [editTrainer, setEditTrainer] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Fetch Role, Trainers, and Events
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
    fetchTrainers();
    fetchEvents();
  }, []);

  // ✅ Fetch Trainers List
  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/trainers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTrainers(data.trainers || []);
      else alert(`⚠️ ${data.message || "Failed to fetch trainers"}`);
    } catch (err) {
      console.error("Error fetching trainers:", err);
      alert("❌ Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch All Events for Dropdown
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      if (data.success) setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // ✅ Handle Input Changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Add or Update Trainer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.expertise) {
      alert("⚠️ Please fill in all required fields!");
      return;
    }

    const url = editTrainer
      ? `http://localhost:5000/api/trainers/${editTrainer}`
      : "http://localhost:5000/api/trainers";
    const method = editTrainer ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        alert(editTrainer ? "✅ Trainer updated successfully!" : "✅ Trainer added successfully!");
        resetForm();
        fetchTrainers();
      } else {
        alert(`⚠️ ${data.message || "Error saving trainer"}`);
      }
    } catch (err) {
      console.error("Error saving trainer:", err);
      alert("❌ Failed to save trainer.");
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setForm({
      name: "",
      expertise: "",
      email: "",
      eventId: "",
      room: "",
      date: "",
      time: "",
    });
    setEditTrainer(null);
  };

  // ✅ Delete Trainer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/trainers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Trainer deleted successfully.");
        fetchTrainers();
      } else {
        alert(data.message || "Failed to delete trainer.");
      }
    } catch (err) {
      console.error("Error deleting trainer:", err);
      alert("❌ Server error while deleting trainer.");
    }
  };

  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/10 p-6 sm:p-10 mt-10"
      >
        <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <Briefcase className="text-blue-400" />
          Trainer & Resource Allocation
        </h1>

        {/* ============================ STUDENT VIEW ============================ */}
        {role === "student" && (
          <div>
            {loading ? (
              <p className="text-gray-400 text-center py-10">
                Loading trainers...
              </p>
            ) : trainers.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                No trainers assigned yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((t) => (
                  <div
                    key={t._id}
                    className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-md hover:scale-[1.02] transition-transform"
                  >
                    <h2 className="text-xl font-semibold">{t.name}</h2>
                    <p className="text-gray-300 text-sm">{t.expertise}</p>
                    <p className="text-gray-400 text-xs">{t.email}</p>
                    {t.eventId && (
                      <p className="mt-2 text-blue-300 text-sm">
                        <strong>Event:</strong> {t.eventId?.title || "N/A"}
                      </p>
                    )}
                    {t.room && (
                      <p className="text-gray-300 text-sm">
                        <strong>Room:</strong> {t.room}
                      </p>
                    )}
                    {t.date && (
                      <p className="text-gray-400 text-sm">
                        <strong>Date:</strong> {t.date} |{" "}
                        <strong>Time:</strong> {t.time}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================ FACULTY/ADMIN VIEW ============================ */}
        {(role === "faculty" || role === "admin") && (
          <>
            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 p-5 rounded-xl border border-white/10 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="text-blue-400" />
                {editTrainer ? "Edit Trainer" : "Add New Trainer"}
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Trainer Name"
                  required
                  className="px-3 py-2 bg-white/15 text-white rounded-lg"
                />
                <input
                  type="text"
                  name="expertise"
                  value={form.expertise}
                  onChange={handleChange}
                  placeholder="Expertise"
                  required
                  className="px-3 py-2 bg-white/15 text-white rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="px-3 py-2 bg-white/15 text-white rounded-lg"
                />
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <select
                  name="eventId"
                  value={form.eventId}
                  onChange={handleChange}
                  className="px-3 py-2 bg-white/15 text-white rounded-lg"
                >
                  <option value="">Assign Event</option>
                  {events.map((e) => (
                    <option key={e._id} value={e._id} className="text-black">
                      {e.title}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  placeholder="Room/Lab"
                  className="px-3 py-2 bg-white/15 text-white rounded-lg"
                />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="px-3 py-2 bg-white/15 text-white rounded-lg"
                />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="px-3 py-2 bg-white/15 text-white rounded-lg"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="mt-5 flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Save size={18} />
                {editTrainer ? "Update Trainer" : "Save Trainer"}
              </motion.button>
            </form>

            {/* TRAINER TABLE */}
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-gray-400 text-center py-10">
                  Loading trainer list...
                </p>
              ) : (
                <table className="w-full border border-white/10">
                  <thead>
                    <tr className="bg-white/10 text-left text-gray-300">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Expertise</th>
                      <th className="py-3 px-4">Event</th>
                      <th className="py-3 px-4">Room</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers.map((t) => (
                      <tr
                        key={t._id}
                        className="border-t border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="py-3 px-4">{t.name}</td>
                        <td className="py-3 px-4">{t.expertise}</td>
                        <td className="py-3 px-4">{t.eventId?.title || "N/A"}</td>
                        <td className="py-3 px-4">{t.room || "-"}</td>
                        <td className="py-3 px-4">
                          {t.date || "-"} {t.time ? `| ${t.time}` : ""}
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            onClick={() => {
                              setEditTrainer(t._id);
                              setForm({
                                name: t.name,
                                expertise: t.expertise,
                                email: t.email,
                                eventId: t.eventId?._id || "",
                                room: t.room || "",
                                date: t.date || "",
                                time: t.time || "",
                              });
                            }}
                            className="px-3 py-1 bg-yellow-500/30 text-yellow-200 rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="px-3 py-1 bg-red-600/30 text-red-300 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default TrainerAllocation;
