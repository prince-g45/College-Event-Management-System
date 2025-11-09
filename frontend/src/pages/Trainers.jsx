import React, { useEffect, useState } from "react";

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    domain: "",
    contactNumber: "",
    resourceFileUrl: "",
  });

  // Fetch all trainers
  const fetchTrainers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/trainers");
      const data = await res.json();
      if (data.success) setTrainers(data.trainers);
    } catch (error) {
      console.error("Fetch trainers error:", error);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const res = await fetch("http://localhost:5000/api/trainers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("Trainer added successfully!");
        setForm({
          name: "",
          organization: "",
          domain: "",
          contactNumber: "",
          resourceFileUrl: "",
        });
        fetchTrainers();
      } else {
        alert(data.message || "Failed to add trainer");
      }
    } catch (error) {
      console.error("Error adding trainer:", error);
      alert("Server error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-4">
        Trainer & Resource Management
      </h2>

      {/* Add Trainer Form (Faculty/Admin) */}
      {(localStorage.getItem("userRole") === "faculty" ||
        localStorage.getItem("userRole") === "admin") && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 p-6 rounded-lg mb-8 text-white space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Trainer Name"
              className="p-3 bg-white/20 rounded-lg"
              required
            />
            <input
              name="organization"
              value={form.organization}
              onChange={handleChange}
              placeholder="Organization"
              className="p-3 bg-white/20 rounded-lg"
            />
            <input
              name="domain"
              value={form.domain}
              onChange={handleChange}
              placeholder="Domain (AI, ML, Web Dev...)"
              className="p-3 bg-white/20 rounded-lg"
            />
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="p-3 bg-white/20 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Save Trainer
          </button>
        </form>
      )}

      {/* Trainers List */}
      <div className="grid md:grid-cols-2 gap-4">
        {trainers.length === 0 ? (
          <p className="text-gray-400">No trainers added yet.</p>
        ) : (
          trainers.map((trainer) => (
            <div
              key={trainer._id}
              className="bg-white/10 rounded-lg p-4 text-white"
            >
              <h3 className="text-xl font-semibold">{trainer.name}</h3>
              <p className="text-gray-300">
                {trainer.domain || "N/A"} — {trainer.organization || "N/A"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Contact: {trainer.contactNumber || "Not provided"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Trainers;
