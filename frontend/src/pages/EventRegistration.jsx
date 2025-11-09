import React, { useEffect, useState } from "react";

const EventRegistration = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // Fetch all events on load
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      if (data.success) setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safely update registration status
  const updateStatus = async (eventId, rawUserId, status) => {
    try {
      // Ensure userId is a clean 24-character hex string
      const userId =
        typeof rawUserId === "object" && rawUserId?._id
          ? rawUserId._id
          : rawUserId?.toString?.();

      if (!userId || userId.length !== 24) {
        alert("❌ Invalid user ID. Cannot update status.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/events/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, userId, status }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
        fetchEvents(); // refresh list
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("❌ Failed to update status. Check console for details.");
    }
  };

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;

  // Restrict student access
  if (role === "student") {
    return (
      <div className="text-center text-gray-300 mt-20 text-lg">
        ⚠️ Access restricted — only Faculty/Admin can approve or reject.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">
        Event Registration & Approval
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-400">No events found.</p>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-6"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              {event.title}
            </h3>

            {event.registeredUsers?.length === 0 ? (
              <p className="text-gray-400">No registrations yet.</p>
            ) : (
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="text-left border-b border-gray-600">
                    <th className="py-2">Student Name</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {event.registeredUsers.map((user, idx) => (
                    <tr key={idx} className="border-b border-gray-700">
                      <td className="py-2">{user.userName}</td>
                      <td className="py-2 capitalize">{user.status}</td>
                      <td className="py-2 space-x-3">
                        {user.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(event._id, user.userId, "approved")
                              }
                              className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg text-white text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(event._id, user.userId, "rejected")
                              }
                              className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-white text-xs"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded ${
                              user.status === "approved"
                                ? "bg-green-700/50 text-green-300"
                                : "bg-red-700/50 text-red-300"
                            }`}
                          >
                            {user.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EventRegistration;
