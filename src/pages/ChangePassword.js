import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "professor") {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage("❌ New passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/professors/change_password`, 
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("✅ Password changed successfully!");
        // Optionally navigate away after a few seconds
      }
    } catch (error) {
      console.error("❌ Error changing password:", error);
      if (error.response && error.response.data.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage("❌ An error occurred while changing password.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Change Password</h2>

      <button
        className="btn btn-secondary my-3"
        onClick={() => navigate("/professor-dashboard")}
      >
        ← Back to Dashboard
      </button>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group mt-3">
          <label>Current Password:</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Confirm New Password:</label>
          <input
            type="password"
            className="form-control"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
