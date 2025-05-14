import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { access_token, role, user_id } = response.data;

      // Store the token and role in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", String(user_id));

      // Redirect based on user role
      if (role === "admin") {
        navigate("/dashboard"); // Admin dashboard
      } else if (role === "professor") {
        navigate("/professor-dashboard"); // Professor dashboard
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin/Professor Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
