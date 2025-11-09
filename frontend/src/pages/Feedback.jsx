import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, MessageSquare } from "lucide-react";

const Feedback = () => {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setRole(userRole);

    if (userRole === "faculty" || userRole === "admin") {
      fetchAllFeedbacks();
    }
  }, [userRole]);

  // ✅ Fetch All Feedbacks (Faculty/Admin)
  const fetchAllFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setFeedbackList(data.all);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit Feedback (Student)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || rating === 0) {
      alert("Please provide feedback and rating!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, rating }),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Feedback submitted successfully!");
        setMessage("");
        setRating(0);
      } else {
        alert("⚠️ Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Submit Feedback Error:", error);
      alert("Server error while submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Render Stars for Rating
  const StarRating = () => (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => setRating(star)}
          className={`cursor-pointer transition ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          }`}
          size={24}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white/10 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/10 p-6 sm:p-10 mt-10"
      >
        <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <MessageSquare className="text-blue-400" />
          Feedback Management
        </h1>

        {/* ==========================================================
           🎓 STUDENT VIEW — FEEDBACK FORM
        ========================================================== */}
        {role === "student" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Your Feedback
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your thoughts about events or trainers..."
                className="w-full px-4 py-3 rounded-xl bg-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Rating
              </label>
              <StarRating />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                loading
                  ? "bg-blue-800/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              }`}
            >
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Feedback"}
            </motion.button>
          </form>
        )}

        {/* ==========================================================
           👨‍🏫 FACULTY / ADMIN VIEW — FEEDBACK LIST
        ========================================================== */}
        {(role === "faculty" || role === "admin") && (
          <div>
            {loading ? (
              <p className="text-gray-400 text-center py-10 animate-pulse">
                Loading feedbacks...
              </p>
            ) : feedbackList.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                No feedback available yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-white/10 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-white/10 text-left text-gray-300">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Message</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackList.map((fb, index) => (
                      <tr
                        key={index}
                        className="border-t border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="py-3 px-4 text-gray-300">{index + 1}</td>
                        <td className="py-3 px-4 text-white">
                          {fb.userId?.name || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {fb.userId?.role || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-200">{fb.message}</td>
                        <td className="py-3 px-4">
                          {"⭐".repeat(fb.rating)}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {new Date(fb.createdAt).toLocaleDateString()}
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

export default Feedback;
