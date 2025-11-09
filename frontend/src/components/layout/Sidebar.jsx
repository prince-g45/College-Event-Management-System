import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Calendar,
  BarChart,
  MessageSquare,
  LogOut,
  UserCheck,
  Briefcase,
  Bell,
  UserPlus,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);

  // ✅ Role-based navigation items
  const navItems = [
    { path: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/events", icon: <Calendar size={20} />, label: "Events" },

    // ✅ Faculty/Admin-only → Add Event
    ...(role === "faculty" || role === "admin"
      ? [
          {
            path: "/add-event",
            icon: <PlusCircle size={20} />,
            label: "Add Event",
          },
        ]
      : []),

    // ✅ Student-only → My Events
    ...(role === "student"
      ? [
          {
            path: "/my-events",
            icon: <ClipboardList size={20} />,
            label: "My Events",
          },
        ]
      : []),

    // ✅ Faculty/Admin-only → Registration Page
    ...(role === "faculty" || role === "admin"
      ? [
          {
            path: "/event-registration",
            icon: <UserPlus size={20} />,
            label: "Registration",
          },
        ]
      : []),

    // ✅ Common Pages
    { path: "/attendance", icon: <UserCheck size={20} />, label: "Attendance" },
    {
      path: "/trainer-allocation",
      icon: <Briefcase size={20} />,
      label: "Trainers",
    },
    { path: "/notifications", icon: <Bell size={20} />, label: "Notifications" },

    // ✅ Faculty/Admin-only Analytics
    ...(role === "faculty" || role === "admin"
      ? [
          {
            path: "/analytics",
            icon: <BarChart size={20} />,
            label: "Analytics",
          },
        ]
      : []),

    { path: "/feedback", icon: <MessageSquare size={20} />, label: "Feedback" },
  ];

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Auto-close sidebar on small screens
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (window.innerWidth < 1024 && isOpen && !e.target.closest(".sidebar")) {
        toggleSidebar();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <motion.div
      animate={{ width: isOpen ? "240px" : "70px" }}
      transition={{ duration: 0.3 }}
      className={`sidebar h-screen fixed top-0 left-0 z-50
        bg-gradient-to-b from-[#0a0f1f] via-[#111b3d] to-[#1c2b6c]
        text-white shadow-lg flex flex-col
        border-r border-white/10 backdrop-blur-xl
        transition-all duration-300 ease-in-out`}
    >
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isOpen && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-lg tracking-wide text-white"
          >
            CEPS
          </motion.h1>
        )}
      </div>

      {/* ================= Navigation ================= */}
      <nav className="flex flex-col gap-2 px-3 mt-6">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-blue-600/40 text-white shadow-md border-l-4 border-blue-400"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
            title={!isOpen ? label : ""}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="min-w-[24px]"
            >
              {icon}
            </motion.div>
            {isOpen && <span className="font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ================= Logout ================= */}
      <div className="mt-auto px-3 mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-gray-300 hover:text-white hover:bg-red-600/30 px-3 py-3 rounded-lg transition-all"
          title={!isOpen ? "Logout" : ""}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* ================= Footer ================= */}
      {isOpen && (
        <p className="text-xs text-gray-400 text-center pb-4">
          © 2025 CEPS Portal
        </p>
      )}
    </motion.div>
  );
};

export default Sidebar;
