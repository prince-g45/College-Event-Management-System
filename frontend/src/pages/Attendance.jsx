// ===========================================
// ✅ CEPS Frontend — Attendance Page (Final Synced Version)
// ===========================================
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Save, Filter } from "lucide-react";

const Attendance = () => {
  const [role, setRole] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [myAttendance, setMyAttendance] = useState([]);
  const token = localStorage.getItem("token");

  // ✅ Load user role from localStorage
  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "");
    fetchEvents();
  }, []);

  // ✅ Fetch All Events
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      if (data.success) setEvents(data.events);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
    }
  };

  // ✅ Fetch Students for Selected Event (Approved Only)
  const fetchStudents = async () => {
    if (!selectedEvent) {
      alert("⚠️ Please select an event first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/event/${selectedEvent}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.success) {
        // ✅ Each student contains ID, name, and email (from backend)
        setStudents(data.students);

        // ✅ Initialize attendance with all "present" by default
        const initialAttendance = {};
        data.students.forEach((s) => {
          if (s.studentId) {
            initialAttendance[s.studentId] = "present";
          }
        });
        setAttendance(initialAttendance);
      } else {
        alert(data.message || "Failed to fetch students.");
      }
    } catch (err) {
      console.error("❌ Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Attendance Marking
  const handleMark = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // ✅ Save Attendance
  const saveAttendance = async () => {
    if (!selectedEvent || Object.keys(attendance).length === 0) {
      alert("⚠️ Please select an event and mark attendance first!");
      return;
    }

    // ✅ Prepare correct attendance payload
    const records = students
      .filter((s) => s.studentId && attendance[s.studentId])
      .map((s) => ({
        studentId: s.studentId,
        studentName: s.studentName,
        email: s.email,
        status: attendance[s.studentId],
      }));

    console.log("📤 Sending Attendance Payload:", {
      eventId: selectedEvent,
      records,
    });

    try {
      const res = await fetch("http://localhost:5000/api/attendance/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: selectedEvent, records }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Attendance saved successfully!");
      } else {
        alert(`⚠️ ${data.message || "Failed to save attendance"}`);
      }
    } catch (err) {
      console.error("❌ Error saving attendance:", err);
      alert("Server error while saving attendance.");
    }
  };

  // ✅ Fetch Student’s Own Attendance (Student Role)
  useEffect(() => {
    if (role === "student") fetchMyAttendance();
  }, [role]);

  const fetchMyAttendance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMyAttendance(data.attendance);
    } catch (err) {
      console.error("❌ Error fetching student attendance:", err);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/10 p-8 mt-10"
      >
        <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <Calendar className="text-blue-400" />
          Attendance Management
        </h1>

        {/* FACULTY / ADMIN VIEW */}
        {(role === "faculty" || role === "admin") && (
          <>
            {/* Event Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/15 text-white border border-white/20"
              >
                <option value="">Select Event</option>
                {events.map((e) => (
                  <option key={e._id} value={e._id} className="text-black">
                    {e.title}
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchStudents}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"
              >
                <Filter size={18} /> Filter Students
              </motion.button>
            </div>

            {/* Attendance Table */}
            {loading ? (
              <p className="text-gray-400 text-center">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-gray-400 text-center">
                No approved students found.
              </p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full border border-white/10">
                  <thead>
                    <tr className="bg-white/10 text-left text-gray-300">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr
                        key={s.studentId}
                        className="border-t border-white/10 hover:bg-white/10"
                      >
                        <td className="py-3 px-4">{s.studentName}</td>
                        <td className="py-3 px-4">{s.email}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={s.studentId}
                                checked={attendance[s.studentId] === "present"}
                                onChange={() =>
                                  handleMark(s.studentId, "present")
                                }
                              />
                              <span className="text-green-300 text-sm">
                                Present
                              </span>
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={s.studentId}
                                checked={attendance[s.studentId] === "absent"}
                                onChange={() =>
                                  handleMark(s.studentId, "absent")
                                }
                              />
                              <span className="text-red-300 text-sm">Absent</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={saveAttendance}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500"
                  >
                    <Save size={18} /> Save Attendance
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}

        {/* STUDENT VIEW */}
        {role === "student" && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="text-blue-400" /> My Attendance Records
            </h2>

            {myAttendance.length === 0 ? (
              <p className="text-gray-400">No attendance records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-white/10">
                  <thead>
                    <tr className="bg-white/10 text-left text-gray-300">
                      <th className="py-3 px-4">Event</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Venue</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAttendance.map((a) => (
                      <tr
                        key={a._id}
                        className="border-t border-white/10 hover:bg-white/10"
                      >
                        <td className="py-3 px-4">{a.eventId?.title}</td>
                        <td className="py-3 px-4">
                          {new Date(a.eventId?.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{a.eventId?.venue}</td>
                        <td
                          className={`py-3 px-4 font-medium ${
                            a.status === "present"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {a.status.toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Attendance;
