import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import { api } from "../api";
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1e5c, #5f3dc4);
`;

const Card = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333333;
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  text-align: center;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
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

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #5f3dc4;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #4b3399;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`${API_BASE}/auth/login`, { email, password });
      const { access_token, role, user_id } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", String(user_id));
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "professor") {
        navigate("/professor-dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <PageWrapper>
      <Card>
        <LogoWrapper>
          <img
            src="/assets/ASE_Logo_nou_mic.png"
            alt="ASE Logo"
            style={{ width: "120px" }}
          />
        </LogoWrapper>

        <Title>Attendance Manager</Title>
        <Title>Login to Your Account</Title>
        {error && <ErrorText>{error}</ErrorText>}
        <Form onSubmit={handleLogin}>
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
          <Button type="submit">Login</Button>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default Login;
