import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, Loader2 } from "lucide-react";

const Analytics = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (role === "faculty" || role === "admin") fetchFeedbackAnalytics();
  }, [role]);

  // ✅ Fetch feedback from backend and compute averages
  const fetchFeedbackAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.all.length > 0) {
        // Group feedback by event (or 'General' if no eventId)
        const grouped = {};

        data.all.forEach((fb) => {
          const eventName =
            fb.eventId?.title || "General Feedback"; // fallback if event not linked
          if (!grouped[eventName]) grouped[eventName] = { total: 0, count: 0 };
          grouped[eventName].total += fb.rating || 0;
          grouped[eventName].count++;
        });

        const formattedData = Object.keys(grouped).map((event) => ({
          event,
          average: (grouped[event].total / grouped[event].count).toFixed(2),
        }));

        setFeedbackData(formattedData);
      } else {
        setFeedbackData([]);
      }
    } catch (error) {
      console.error("Analytics Fetch Error:", error);
    } finally {
      setLoading(false);
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
          <BarChart3 className="text-blue-400" />
          Analytics Dashboard
        </h1>

        {/* ==========================
            ROLE RESTRICTION NOTICE
        =========================== */}
        {role === "student" && (
          <p className="text-center text-gray-400 mt-10 text-lg">
            ⚠️ Access restricted — only Faculty/Admin can view analytics.
          </p>
        )}

        {/* ==========================
            CHART SECTION
        =========================== */}
        {(role === "faculty" || role === "admin") && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-20 text-gray-300">
                <Loader2 className="animate-spin mr-2" /> Loading Analytics...
              </div>
            ) : feedbackData.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No feedback data available yet.
              </p>
            ) : (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={feedbackData}
                    margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis
                      dataKey="event"
                      tick={{ fill: "#ccc", fontSize: 12 }}
                      interval={0}
                      angle={-15}
                      height={60}
                    />
                    <YAxis tick={{ fill: "#ccc" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30,30,60,0.9)",
                        border: "none",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="average"
                      fill="url(#colorBlue)"
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="colorBlue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
