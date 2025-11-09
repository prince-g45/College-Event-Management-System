import React, { useState } from "react";
import { motion } from "framer-motion";

const ChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) alert("✅ Password changed successfully!");
      else alert(data.message);
    } catch {
      alert("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/15 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/15 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg py-3"
        >
          {loading ? "Updating..." : "Change Password"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChangePassword;
