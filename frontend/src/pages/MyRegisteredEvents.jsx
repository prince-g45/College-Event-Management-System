import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, CheckCircle } from "lucide-react";

const MyRegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const fetchApprovedEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events/approved/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setEvents(data.events);
    } catch (err) {
      console.error("Error fetching approved events:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/10 p-8 mt-10"
      >
        <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <CheckCircle className="text-green-400" /> My Approved Events
        </h1>

        {loading ? (
          <p className="text-gray-400 text-center">Loading your events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            You have no approved events yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-lg hover:shadow-blue-500/20 transition"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-300 flex items-center gap-2">
                  <Calendar size={18} /> {event.title}
                </h2>
                <p className="text-gray-300 text-sm mb-2">
                  {event.description || "No description available"}
                </p>
                <div className="flex items-center text-sm text-gray-400 gap-2 mb-1">
                  <MapPin size={16} /> {event.venue || "Not specified"}
                </div>
                <div className="text-sm text-gray-400">
                  📅 {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="mt-4 bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-center text-sm font-medium">
                  Approved
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyRegisteredEvents;
