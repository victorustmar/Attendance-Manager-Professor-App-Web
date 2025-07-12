import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api } from "../api";
import { API_BASE } from "../api";
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
  text-align: center;
`;

const Header = styled.h1`
  color: #1e1e5c;
  margin-bottom: 1rem;
`;

const SubHeader = styled.h2`
  color: #5f3dc4;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #5f3dc4;
  color: #ffffff;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #4b3399;
  }
`;

const Separator = styled.div`
  height: 1px;
  background: rgb(67, 69, 173);
  margin: 1.5rem 0;
`;

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "professor") {
      navigate("/");
    } else {
      api.get(`${API_BASE}/professors/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setFullName(res.data.full_name); // ✅ This sets the name
        })
        .catch(() => {
          localStorage.clear();
          navigate("/");
        });
    }
  }, [navigate]);

  return (
    <PageWrapper>
      <Card>
        <Header>Welcome!</Header>
        <SubHeader>Prof. {fullName}</SubHeader>
        <ButtonGrid>
          <Button onClick={() => navigate("/generate-qr")}>Generate Attendance QR Code</Button>
          <Button onClick={() => navigate("/manual-attendance")}>Manual Attendance</Button>
          <Button onClick={() => navigate("/professor-attendance")}>View Attendance Lists</Button>
          <Separator />
          <Button onClick={() => navigate("/change-password")}>Change Password</Button>
          <Separator />
          <Button onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/");
          }}>
            Logout
          </Button>
        </ButtonGrid>
      </Card>
    </PageWrapper>
  );
};

export default ProfessorDashboard;
