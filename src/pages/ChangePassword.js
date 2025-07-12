import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API_BASE } from "../api";
import { api } from "../api";

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
  max-width: 400px;
`;

const Header = styled.h2`
  color: #1e1e5c;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const BackButton = styled.button`
  background: #999999;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 1.5rem;
  &:hover {
    background: #777777;
  }
`;

const Message = styled.p`
  background: #eef5ff;
  color: #1e1e5c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: #333333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #5f3dc4;
    box-shadow: 0 0 0 3px rgba(95, 61, 196, 0.2);
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
  margin-top: 1rem;
  transition: background 0.3s ease;
  &:hover {
    background: #4b3399;
  }
`;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "professor") {
      navigate("/");
    }
  }, [navigate, token, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match!");
      return;
    }
    try {
      const response = await api.post(
        `${API_BASE}/professors/change_password`,
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setMessage("Password changed successfully!");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      const errMsg = error.response?.data?.error || "An error occurred while changing password.";
      setMessage(`${errMsg}`);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <BackButton onClick={() => navigate("/professor-dashboard")}>Back to Dashboard</BackButton>
        <Header>Change Password</Header>
        {message && <Message>{message}</Message>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Confirm New Password</Label> 
              <Input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">Change Password</Button>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default ChangePassword;
