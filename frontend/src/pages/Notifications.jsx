import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Loader2 } from "lucide-react";

const Notifications = () => {
  const [role, setRole] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", recipients: ["student"] });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Load role & fetch notifications on mount
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
    fetchNotifications();
  }, []);

  // ✅ Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle notification send
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return alert("Please fill in all fields.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Notification sent successfully!");
        setForm({ title: "", message: "", recipients: ["student"] });
        fetchNotifications(); // refresh list
      } else {
        alert("⚠️ Failed to send notification");
      }
    } catch (err) {
      console.error("Send notification error:", err);
      alert("Server error while sending notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl shadow-lg border border-white/10 p-8 mt-10"
      >
        <h1 className="text-3xl font-semibold flex items-center gap-3 mb-6">
          <Bell className="text-yellow-400" /> Notifications & Announcements
        </h1>

        {/* FACULTY / ADMIN VIEW */}
        {(role === "faculty" || role === "admin") && (
          <form onSubmit={handleSubmit} className="mb-10">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                className="px-4 py-2 bg-white/15 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                name="recipients"
                value={form.recipients}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recipients: [e.target.value],
                  })
                }
                className="px-4 py-2 bg-white/15 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="student" className="text-black">
                  Students
                </option>
                <option value="faculty" className="text-black">
                  Faculty
                </option>
                <option value="admin" className="text-black">
                  Admins
                </option>
                <option value="all" className="text-black">
                  All Users
                </option>
              </select>
            </div>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write notification message..."
              rows={4}
              className="w-full mt-4 px-4 py-3 bg-white/15 text-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className={`mt-4 px-6 py-3 rounded-lg flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {loading ? "Sending..." : "Send Notification"}
            </motion.button>
          </form>
        )}

        {/* NOTIFICATION LIST */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No notifications yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {notifications.map((note) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold text-yellow-300">{note.title}</h3>
                  <p className="text-gray-200 mt-2 text-sm">{note.message}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    Sent by:{" "}
                    <span className="font-medium text-white">
                      {note.sender?.name || "Unknown"}
                    </span>{" "}
                    ({note.sender?.role || "N/A"})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
