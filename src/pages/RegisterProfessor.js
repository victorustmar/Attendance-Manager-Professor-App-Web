// Make sure to install styled-components: npm install styled-components
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API_BASE } from "../api";

// ************ Styled Components ************
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1e5c, #5f3dc4);
  padding: 20px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e1e5c;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    border-color: #5f3dc4;
    box-shadow: 0 0 0 3px rgba(95, 61, 196, 0.2);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #ffffff;
  &:focus {
    border-color: #5f3dc4;
    box-shadow: 0 0 0 3px rgba(95, 61, 196, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #5f3dc4;
  color: #ffffff;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.3s ease;
  &:hover {
    background: #4b3399;
  }
`;

const BackButton = styled(Button)`
  background: #999999;
  margin-top: 1rem;
  &:hover {
    background: #777777;
  }
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  color: #4caf50;
  text-align: center;
  margin-bottom: 1rem;
`;

// ************ Component ************
const RegisterProfessor = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/");
      return;
    }
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/faculties`, { headers: { Authorization: `Bearer ${token}` } });
        setFaculties(response.data);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      }
    };
    fetchFaculties();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/auth/register-professor`,
        { full_name: fullName, email, password, faculty_id: facultyId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
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
    <PageWrapper>
      <Card>
        <Title>Register a Professor</Title>
        {error && <ErrorText>{error}</ErrorText>}
        {success && <SuccessText>{success}</SuccessText>}
        <Form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Select value={facultyId} onChange={(e) => setFacultyId(e.target.value)} required>
            <option value="">Select Faculty</option>
            {faculties.map((fac) => (
              <option key={fac.faculty_id} value={fac.faculty_id}>
                {fac.faculty_name}
              </option>
            ))}
          </Select>
          <Button type="submit">Register Professor</Button>
        </Form>
        <BackButton onClick={() => navigate("/dashboard")}>Back to Dashboard</BackButton>
      </Card>
    </PageWrapper>
  );
};

export default RegisterProfessor;
