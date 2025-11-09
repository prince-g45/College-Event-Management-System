import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Clear old sessions on mount
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      alert("⚠️ Please fill in all fields!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...credentials, role }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        // ✅ Save user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role || role);
        localStorage.setItem("isLoggedIn", "true");

        console.log("✅ Login Success:", {
          id: data.user._id,
          name: data.user.name,
          role: data.user.role,
        });

        alert("🎉 Login successful!");

        // ✅ Redirect based on role
        if (data.user.role === "student") navigate("/events");
        else navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      alert("⚠️ Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1f] via-[#111b3d] to-[#1c2b6c] px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* 🌌 Background Lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.15),transparent_60%)]"></div>

      {/* 🧊 Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 md:p-10 z-10"
      >
        {/* 💫 Decorative Blurs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600/20 blur-3xl rounded-full"></div>

        {/* 🏫 Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
            CEPS Portal
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            College Event & Program Management System
          </p>
        </motion.div>

        {/* 🧩 Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-white/15 text-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 bg-white/15 text-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-3 bg-white/15 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            >
              <option value="student" className="text-gray-900">
                Student
              </option>
              <option value="faculty" className="text-gray-900">
                Faculty
              </option>
              <option value="admin" className="text-gray-900">
                Admin
              </option>
            </select>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-3 shadow-lg shadow-blue-900/40 transition-all duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* 🔗 Signup Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
          >
            Sign Up
          </span>
        </p>

        {/* ⚡ Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2025 CEPS — All Rights Reserved
        </p>
      </motion.div>
    </div>
  );
};

export default Login;