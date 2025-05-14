import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
const ImportProfessors = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE}/professors/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage("✅ Professors imported successfully!");
      } else if (response.status === 207) {
        setMessage(`⚠️ Partial Success: Some entries failed. Check console for details.`);
        console.log(response.data);  // Print detailed issues in the console
      }
    } catch (error) {
      console.error("❌ Error importing professors:", error);
      setMessage("❌ Failed to import professors.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Import Professors</h2>

      <button
        className="btn btn-secondary my-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Upload Professors
        </button>
      </form>
    </div>
  );
};

export default ImportProfessors;
