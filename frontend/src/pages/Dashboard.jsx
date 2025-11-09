// ===========================================
// ✅ CEPS Frontend — Dashboard Page (Final Updated with Trainers Popup)
// ===========================================

import React, { useEffect, useState } from "react";
import { Calendar, Users, Star, Briefcase } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeParticipants: 0,
    approvedRegistrations: 0,
    trainersInvited: 0,
    role: "",
    events: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [trainers, setTrainers] = useState([]); // ✅ New state for trainers

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Trainers (for popup table)
  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/trainers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTrainers(data.trainers);
    } catch (err) {
      console.error("❌ Error fetching trainers:", err);
    }
  };

  // ✅ Handle Card Click
  const handleCardClick = (category) => {
    setSelectedCategory(category);
    const userId = localStorage.getItem("userId");
    const { events, role } = stats;

    if (category === "trainers") {
      fetchTrainers(); // 🧠 Load trainers dynamically
      return;
    }

    if (role === "student") {
      if (category === "total") setFilteredEvents(events);
      else if (category === "active")
        setFilteredEvents(
          events.filter((e) =>
            e.registeredUsers.some(
              (u) => u.userId === userId || u.userId?._id === userId
            )
          )
        );
      else if (category === "approved")
        setFilteredEvents(
          events.filter((e) =>
            e.registeredUsers.some(
              (u) =>
                (u.userId === userId || u.userId?._id === userId) &&
                u.status === "approved"
            )
          )
        );
      else setFilteredEvents([]);
    } else {
      if (category === "total") setFilteredEvents(events);
      else if (category === "active")
        setFilteredEvents(events.filter((e) => e.registeredUsers.length > 0));
      else if (category === "approved")
        setFilteredEvents(
          events.filter((e) =>
            e.registeredUsers.some((u) => u.status === "approved")
          )
        );
      else setFilteredEvents([]);
    }
  };

  if (loading)
    return (
      <div className="text-white text-center mt-10">Loading Dashboard...</div>
    );

  const { role, totalEvents, activeParticipants, approvedRegistrations, trainersInvited } = stats;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Dashboard Overview</h1>
      <p className="text-gray-300 mb-8">
        {role === "student"
          ? "Welcome Student! Track your registered and approved events below."
          : "Get a quick insight into all events, participants, and trainers."}
      </p>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardCard
          title="Total Events"
          value={totalEvents}
          icon={<Calendar size={28} />}
          color="from-blue-500 to-blue-700"
          onClick={() => handleCardClick("total")}
        />
        <DashboardCard
          title={role === "student" ? "My Registered Events" : "Active Participants"}
          value={activeParticipants}
          icon={<Users size={28} />}
          color="from-green-500 to-green-700"
          onClick={() => handleCardClick("active")}
        />
        <DashboardCard
          title="Approved Registrations"
          value={approvedRegistrations}
          icon={<Star size={28} />}
          color="from-yellow-500 to-yellow-700"
          onClick={() => handleCardClick("approved")}
        />
        <DashboardCard
          title="Trainers Invited"
          value={trainersInvited}
          icon={<Briefcase size={28} />}
          color="from-pink-500 to-pink-700"
          onClick={() => handleCardClick("trainers")}
        />
      </div>

      {/* Popup for Events or Trainers */}
      {selectedCategory && (
        <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white capitalize">
              {selectedCategory === "trainers"
                ? "Invited Trainers"
                : selectedCategory === "total"
                ? "All Events"
                : selectedCategory === "active"
                ? role === "student"
                  ? "My Registered Events"
                  : "Active Participants Events"
                : "Approved Events"}
            </h2>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-gray-400 hover:text-white transition"
            >
              ✖ Close
            </button>
          </div>

          {/* 🧠 Trainers Table */}
          {selectedCategory === "trainers" ? (
            trainers.length === 0 ? (
              <p className="text-gray-400">No trainers invited yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-gray-200">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Expertise</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Event</th>
                      <th className="py-3 px-4">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers.map((t) => (
                      <tr
                        key={t._id}
                        className="hover:bg-white/5 cursor-pointer transition"
                      >
                        <td className="py-3 px-4">{t.name}</td>
                        <td className="py-3 px-4">{t.expertise}</td>
                        <td className="py-3 px-4">{t.email}</td>
                        <td className="py-3 px-4">{t.eventId?.title || "—"}</td>
                        <td className="py-3 px-4">
                          {t.date || "—"} {t.time ? `| ${t.time}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* 🧠 Event Table (existing logic) */
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-gray-200">
                <thead>
                  <tr className="bg-white/10">
                    <th className="py-3 px-4">Event Title</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-white/5 cursor-pointer transition"
                      onClick={() => (window.location.href = "/events")}
                    >
                      <td className="py-3 px-4">{event.title}</td>
                      <td className="py-3 px-4">{event.venue}</td>
                      <td className="py-3 px-4">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {event.status || "upcoming"}
                      </td>
                      <td className="py-3 px-4">
                        {event.registeredUsers.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ✅ Card Component
const DashboardCard = ({ title, value, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-2xl shadow-md bg-gradient-to-br ${color} flex items-center justify-between text-white cursor-pointer hover:scale-105 transition`}
  >
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
    <div className="bg-white/20 p-3 rounded-full">{icon}</div>
  </div>
);

export default Dashboard;
