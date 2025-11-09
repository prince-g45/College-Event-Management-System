// ============================================
// ✅ CEPS Frontend — Events Page (Role-Based & Fixed)
// ============================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Trash2, Edit3 } from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = storedUser?.role || localStorage.getItem("userRole");
  const userId = storedUser?._id;

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      if (data.success) setEvents(data.events);
      else setEvents([]);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get readable status
  const getEventStatus = (event) => {
    if (event.status)
      return event.status.charAt(0).toUpperCase() + event.status.slice(1);
    const today = new Date();
    const date = new Date(event.date);
    if (date.toDateString() === today.toDateString()) return "Ongoing";
    if (date > today) return "Upcoming";
    return "Completed";
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-green-600/30 text-green-300 border border-green-400/30";
      case "ongoing":
        return "bg-yellow-600/30 text-yellow-300 border border-yellow-400/30";
      case "completed":
        return "bg-gray-600/30 text-gray-300 border border-gray-400/30";
      default:
        return "bg-blue-600/30 text-blue-300 border border-blue-400/30";
    }
  };

  // ✅ Delete Event (Faculty/Admin)
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Event deleted successfully!");
        fetchEvents();
      } else alert(`⚠️ ${data.message}`);
    } catch (error) {
      console.error("❌ Delete Event Error:", error);
      alert("Server error while deleting event.");
    }
  };

  // ✅ Open Edit Modal
  const openEditModal = (event) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      venue: event.venue,
      status: event.status,
    });
  };

  // ✅ Handle Edit Changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save Updated Event
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/events/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("✅ Event updated successfully!");
        setEditingEvent(null);
        fetchEvents();
      } else alert(`⚠️ ${data.message}`);
    } catch (error) {
      console.error("❌ Update Event Error:", error);
      alert("Server error while updating event.");
    }
  };

// ✅ Student Register Event
const handleRegister = async (eventId) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/events/${eventId}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Token gives req.user
        },
      }
    );

    const data = await res.json();
    if (data.success) {
      alert("✅ Registered successfully! Waiting for approval.");
      fetchEvents();
    } else {
      alert(`⚠️ ${data.message}`);
    }
  } catch (error) {
    console.error("❌ Registration Error:", error);
    alert("Server error while registering for event.");
  }
};


  const filteredEvents =
    filter === "all"
      ? events
      : events.filter(
          (e) => (e.status || getEventStatus(e)).toLowerCase() === filter
        );

  if (loading)
    return <div className="text-center text-white mt-10">Loading events...</div>;

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Events & Programs</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-400 text-center">No events found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);
            const statusClass = getStatusStyle(status);
            const userReg = event.registeredUsers?.find(
              (u) => u.userId === userId || u.userId?._id === userId
            );
            const isApproved = userReg?.status === "approved";
            const isPending = userReg?.status === "pending";
            const isRegistered = !!userReg;

            return (
              <motion.div
                key={event._id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass}`}
                  >
                    {status}
                  </span>
                  <span className="text-sm text-gray-300">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-300 mt-2">{event.description}</p>
                <div className="flex items-center mt-3 gap-2 text-gray-400 text-sm">
                  <MapPin size={16} />
                  {event.venue}
                </div>

                {/* 🎓 Student Buttons */}
                {role === "student" && (
                  <div className="mt-4">
                    {!isRegistered ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRegister(event._id)}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition"
                      >
                        Register
                      </motion.button>
                    ) : isPending ? (
                      <div className="w-full py-2 rounded-lg bg-yellow-600/20 text-yellow-300 text-center font-medium border border-yellow-400/30">
                        Pending Approval
                      </div>
                    ) : isApproved ? (
                      <div className="w-full py-2 rounded-lg bg-green-600/20 text-green-300 text-center font-medium border border-green-400/30">
                        Approved
                      </div>
                    ) : (
                      <div className="w-full py-2 rounded-lg bg-gray-700/40 text-gray-400 text-center font-medium border border-gray-500/30">
                        Already Registered
                      </div>
                    )}
                  </div>
                )}

                {/* 👨‍🏫 Faculty/Admin Buttons */}
                {(role === "faculty" || role === "admin") && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600/40 hover:bg-blue-600 rounded-lg text-sm"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600/40 hover:bg-red-600 rounded-lg text-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Edit Event</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Title"
                className="w-full bg-white/10 rounded-lg p-2 text-white"
              />
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                placeholder="Description"
                className="w-full bg-white/10 rounded-lg p-2 text-white"
              />
              <input
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
                className="w-full bg-white/10 rounded-lg p-2 text-white"
              />
              <input
                type="text"
                name="venue"
                value={editForm.venue}
                onChange={handleEditChange}
                placeholder="Venue"
                className="w-full bg-white/10 rounded-lg p-2 text-white"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full bg-white/10 rounded-lg p-2 text-white"
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
              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-gray-600/40 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600/40 hover:bg-green-600 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
