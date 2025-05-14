import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
const RegisterProfessor = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch available faculties from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/");  // redirect if not admin
    } else {
      setIsAuthorized(true);
    }
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/faculties`);
        setFaculties(response.data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    fetchFaculties();
  }, [navigate]);

  // ✅ Handle form submission
  const handleRegisterProfessor = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token"); // Get JWT token from localStorage

    try {
      const response = await axios.post(
        `${API_BASE}/auth/register-professor`,
        {
          full_name: fullName,
          email,
          password,
          faculty_id: facultyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Professor registered successfully!");
      setFullName("");
      setEmail("");
      setPassword("");
      setFacultyId("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register a Professor</h2>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <form onSubmit={handleRegisterProfessor}>
        <input
          type="text"
          placeholder="Full Name"
          className="form-control mb-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="form-control mb-2"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          required
        >
          <option value="">Select Faculty</option>
          {faculties.map((faculty) => (
            <option key={faculty.faculty_id} value={faculty.faculty_id}>
              {faculty.faculty_name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" type="submit">
          Register Professor
        </button>
      </form>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default RegisterProfessor;
