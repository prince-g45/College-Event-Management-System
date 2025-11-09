// src/pages/LandingPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, Search, Bell, User } from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* Helper for animated nav links */
const NavLink = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="relative text-sm font-medium text-slate-700 hover:text-blue-600 px-2 py-1 transition"
    aria-label={label}
  >
    <span>{label}</span>
    <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 scale-x-0 hover:scale-x-100 transform origin-left transition-transform duration-300" />
  </button>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* NAVBAR — Glossy White */}
      <header className="sticky top-0 z-50">
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full backdrop-blur-xl bg-white/90 border-b border-slate-200 shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Logo */}
              <div
                onClick={() => {
                  navigate("/");
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <img
                  src="/vglogo.jpg"
                  alt="Vignan CEPS Logo"
                  className="h-12 w-auto object-contain"
                  style={{ borderRadius: 0 }}
                />
                <div className="leading-tight">
                  <div className="text-lg font-semibold text-slate-900">CEPS</div>
                  <div className="text-xs text-slate-500 -mt-0.5">Vignan University</div>
                </div>
              </div>

              {/* Center Nav Links */}
              <div className="hidden md:flex md:items-center md:gap-10">
                <NavLink label="Home" onClick={() => { navigate("/"); setMobileOpen(false); }} />
                <NavLink label="About" onClick={scrollToAbout} />
                <NavLink label="Features" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} />
                <NavLink label="Contact" onClick={() => alert("Contact us: ceps@vignan.ac.in")} />
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <button
                  aria-label="Search"
                  className="hidden lg:inline-flex items-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
                  onClick={() => alert("Search coming soon")}
                >
                  <Search size={17} />
                </button>

                {/* Notification */}
                <button
                  className="hidden lg:inline-flex items-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
                  aria-label="Notifications"
                  onClick={() => alert("No new notifications")}
                >
                  <Bell size={17} />
                </button>

                {/* Login */}
                <button
                  onClick={() => navigate("/login")}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg hover:scale-[1.02] transition"
                >
                  Login <ArrowRight size={14} />
                </button>

                {/* Signup / Profile */}
                <button
                  onClick={() => navigate("/signup")}
                  className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 border border-slate-300 hover:bg-slate-200 transition"
                  title="Sign up"
                >
                  <User size={16} className="text-slate-700" />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileOpen((s) => !s)}
                  className="md:hidden ml-1 p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
                  aria-label="Open menu"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => { navigate("/"); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={scrollToAbout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                About
              </button>
              <button
                onClick={() => alert("Contact us: ceps@vignan.ac.in")}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Contact
              </button>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-2 rounded-md shadow"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        </motion.nav>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="relative min-h-[70vh] md:min-h-[85vh]">
          <img
            src="/vignan.jpg"
            alt="Vignan University Campus"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ zIndex: -1 }}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70 backdrop-blur-[1px]" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-28">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl mx-auto text-white drop-shadow"
            >
              Welcome to <span className="text-blue-400">Vignan's CEPS</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="mt-6 text-gray-200 text-base sm:text-lg max-w-2xl"
            >
              Manage college events, track attendance, generate reports, and collaborate — all in one unified portal by Vignan University.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-10 flex flex-wrap gap-3 justify-center"
            >
              <button
                onClick={() => navigate("/signup")}
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl transition"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg transition"
              >
                Login Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 py-20 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-center mb-6 text-slate-900"
          >
            About the CEPS Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 text-lg"
          >
            <span className="font-semibold text-blue-700">CEPS</span> (College Event and Program
            Management System) is a smart, collaborative platform designed for{" "}
            <span className="font-semibold text-indigo-700">students and faculty</span> to simplify the
            entire event lifecycle — from proposal to feedback — through modern automation and analytics.
          </motion.p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-2xl p-6 rounded-2xl border border-slate-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <i className="fa-solid fa-calendar-check text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Event Management</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Create, approve, publish, and analyze events effortlessly with streamlined tools for organizers and faculty.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-2xl p-6 rounded-2xl border border-slate-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <i className="fa-solid fa-people-group text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Volunteer & SAC</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Collaborate with the Student Activity Council for volunteer allocation, real-time updates, and approvals — all in one place.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-2xl p-6 rounded-2xl border border-slate-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <i className="fa-solid fa-chart-line text-indigo-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Attendance & Analytics</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Track attendance and generate analytical reports to improve event management efficiency.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-black via-slate-900 to-black text-white border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-md">
            Contact Us
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p className="text-base text-gray-200 font-medium">
              Vignan's Foundation for Science, Technology and Research
            </p>
            <p>(Deemed to be University), Vadlamudi, Guntur-522213</p>
            <div className="flex justify-center gap-4 mt-3 text-gray-300">
              <a href="mailto:info@vignan.ac.in" className="flex items-center gap-2 hover:text-blue-400 transition">
                <i className="fa-solid fa-envelope"></i> info@vignan.ac.in
              </a>
              <a href="tel:08632344700" className="flex items-center gap-2 hover:text-blue-400 transition">
                <i className="fa-solid fa-phone"></i> 0863-2344700 / 701
              </a>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl" title="LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition text-xl" title="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition text-xl" title="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500 transition text-xl" title="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>

          {/* Contributors Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="pt-8 text-gray-300"
          >
            <motion.div
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true }}
  className="pt-10"
>
  <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition duration-300">
    {/* Heart icon (glossy gradient) */}
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 text-white shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-7-4.534-9-7.2C1.4 11.6 3 8 6.2 7.2 8.1 6.7 9.5 7.5 12 9.3c2.5-1.8 3.9-2.6 5.8-2.1C21 8 22.6 11.6 21 13.8 19 16.5 12 21 12 21z" />
      </svg>
    </span>

    {/* Text section */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <span className="text-base sm:text-lg text-gray-200 font-medium">
        Developed with <span className="text-pink-400 font-semibold">❤️</span> by
      </span>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        {/* Prince */}
        <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_24px_rgba(79,70,229,0.3)] hover:scale-[1.03] transition">
          <span className="flex flex-col leading-tight text-left">
            <span className="text-[1.05rem]">Prince Kumar</span>
            <span className="text-sm text-white/90 -mt-0.5 font-normal">231FA04G45</span>
          </span>
        </span>

        <span className="text-base text-gray-300 font-semibold">&</span>

        {/* Sachin */}
        <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-[0_8px_24px_rgba(139,92,246,0.3)] hover:scale-[1.03] transition">
          <span className="flex flex-col leading-tight text-left">
            <span className="text-[1.05rem]">Sachin Kumar</span>
            <span className="text-sm text-white/90 -mt-0.5 font-normal">231FA04D62</span>
          </span>
        </span>
      </div>
    </div>
  </div>

  {/* small caption */}
  <div className="mt-4 text-sm sm:text-base text-gray-400/90 font-medium">
    Proudly crafted for{" "}
    <span className="text-white font-semibold bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
      Vignan University's CEPS
    </span>
  </div>
</motion.div>

          </motion.div>

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent mx-auto mt-6" />
          <p className="text-xs text-gray-400 pt-4">
            © {new Date().getFullYear()} Vignan University — All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
