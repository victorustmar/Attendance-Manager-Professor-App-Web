import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
  
      <div className="d-grid gap-3 col-6 mx-auto mt-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/register-professor")}
        >
          Register a Professor
        </button>
  
        
  
        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>

        <button
          className="btn btn-info mt-3"
          onClick={() => navigate("/courses")}
        >
          📋 View Courses
        </button>

        <button
          className="btn btn-info mx-2"
          onClick={() => navigate("/import-courses")}
        >
          📁 Import Courses
        </button>

        <button
          className="btn btn-warning mt-3"
          onClick={() => navigate("/import-professors")}
        >
          📚 Import Professors
        </button>


      </div>
    </div>
  );
};
export default Dashboard;
