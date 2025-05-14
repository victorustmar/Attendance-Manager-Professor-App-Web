import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";
const GenerateQRCode = () => {
  const [qrImage, setQrImage] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "professor") {
      navigate("/");
    }
  }, [navigate, token, role]);



  useEffect(() => {
    const fetchQRCode = async () => {
        try {
          const response = await axios.get(`${API_BASE}/qr/generate_qr`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          setQrImage(response.data.qr_image);
          setCourseName(response.data.course_name);
          setLastUpdated(new Date().toLocaleTimeString());
          setError("");
        } catch (err) {
          console.error("Failed to fetch QR code", err);
          setError("No active course right now.");
        }
      };

    fetchQRCode(); // Fetch immediately
    const interval = setInterval(fetchQRCode, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Clear interval on page leave
  }, [token]);

  if (!token || role !== "professor") return null;

  return (
    <div className="container text-center mt-5">
      <h2>QR Code Generator</h2>

      <button className="btn btn-secondary my-3" onClick={() => navigate("/professor-dashboard")}>
        ← Back to Dashboard
      </button>

      {error && (
        <div className="alert alert-warning mt-3">
          {error}
        </div>
      )}

      {!error && (
        <>
          <h4 className="mt-3">{courseName ? `Course: ${courseName}` : ""}</h4>
          <p>Last updated: {lastUpdated}</p>

          {qrImage ? (
            <img src={qrImage} alt="QR Code" style={{ width: "300px", height: "300px" }} />
          ) : (
            <p>Loading QR Code...</p>
          )}
        </>
      )}
    </div>
  );
};

export default GenerateQRCode;
