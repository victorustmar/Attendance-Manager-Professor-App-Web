import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
const ProfessorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Redirect if not logged in or if the role is not professor
    if (!token || role !== "professor") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1>Welcome to the Professor Dashboard</h1>

      <div className="d-grid gap-2">

        <button className="btn btn-primary mt-3" onClick={() => navigate("/generate-qr")}>
          Generate QR Code
        </button>

        <button
          className="btn btn-primary my-3"
          onClick={() => navigate("/change-password")}
        >
          🔒 Change Password
        </button>

        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate('/manual-attendance')}
        >
          📝 Manual Attendance
        </button>

      
        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/");
          }}
        >
          Logout
        </button>

        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/professor-attendance")}
        >
          📊 View My Courses & Attendance
        </button>
      </div>
    </div>
  );
};

export default ProfessorDashboard;