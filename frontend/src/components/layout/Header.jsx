import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronDown, LogOut, User, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [user, setUser] = useState({ name: "User", role: "" });
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(false);
  const token = localStorage.getItem("token");
  const notifRef = useRef(null);

  // ✅ Load user & notifications
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName") || "User";
    if (storedRole) setUser({ name: storedName, role: storedRole });

    fetchNotifications();

    // Optional: auto refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        // Check if unread exists
        const lastViewed = localStorage.getItem("lastNotifViewedAt");
        const hasUnread =
          data.notifications.some(
            (n) => !lastViewed || new Date(n.createdAt) > new Date(lastViewed)
          );
        setUnread(hasUnread);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ Toggle notification dropdown
  const toggleNotifications = () => {
    const newState = !isNotifOpen;
    setIsNotifOpen(newState);
    if (newState) {
      // Mark as viewed
      setUnread(false);
      localStorage.setItem("lastNotifViewedAt", new Date().toISOString());
    }
  };

  // ✅ Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-40 shadow-lg">
      {/* Title */}
      <h1 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
        {title}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotifications}
            className="relative text-gray-300 hover:text-white transition"
          >
            <Bell size={22} />
            {unread && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg text-white text-sm overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/10 font-semibold">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No new notifications
                    </p>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n._id}
                        className="px-4 py-3 hover:bg-white/10 border-b border-white/10 cursor-pointer"
                        onClick={() => navigate("/notifications")}
                      >
                        <p className="text-sm text-yellow-300 font-medium">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => navigate("/notifications")}
                  className="w-full text-center py-2 bg-white/10 hover:bg-white/20 transition text-sm"
                >
                  View All Notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full text-white transition-all"
          >
            <User size={18} />
            <span className="hidden sm:inline text-sm font-medium">
              {user.name} ({user.role})
            </span>
            <ChevronDown size={16} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg text-white text-sm overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-white/20 transition"
                >
                  <User size={16} /> Update Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/change-password");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-white/20 transition"
                >
                  <Key size={16} /> Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-600/40 transition text-red-200"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
