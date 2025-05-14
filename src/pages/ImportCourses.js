import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
const ImportCourses = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/");
    }
  }, [navigate, token, role]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE}/courses/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Courses imported successfully.");
    } catch (err) {
      setMessage("❌ Failed to import courses.");
      console.error(err);
    }

    setFile(null); // Clear file from state
    e.target.reset();
    
  };

  return (
    <div className="container mt-5">
      <h2>Import Courses from CSV</h2>
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group mt-4">
          <input type="file" accept=".csv" onChange={handleFileChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary mt-3">📥 Upload CSV</button>
        <button
          className="btn btn-secondary mt-3 ms-3"
          onClick={() => navigate("/courses", { replace: true })}
        >
          ← Back to Course List
        </button>
      </form>
    </div>
  );
};

export default ImportCourses;
