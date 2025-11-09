import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => alert("Failed to fetch user data"));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile updated successfully!");
        localStorage.setItem("userName", user.name);
      } else {
        alert(data.message);
      }
    } catch {
      alert("⚠️ Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">Edit Profile</h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Name</label>
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/15 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Email</label>
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/15 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/15 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="student" className="text-gray-900">Student</option>
            <option value="faculty" className="text-gray-900">Faculty</option>
            <option value="admin" className="text-gray-900">Admin</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg py-3"
        >
          {isSaving ? "Saving..." : "Update Profile"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Profile;
