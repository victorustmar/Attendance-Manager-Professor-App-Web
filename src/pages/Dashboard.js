import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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
  text-align: center;
`;

const Header = styled.h1`
  margin-bottom: 2rem;
  color: #1e1e5c;
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-direction: column;
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
  background:rgb(67, 69, 173);
  margin: 1.5rem 0;
`;

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  return (
    <PageWrapper>
      <Card>
        <Header>Admin Dashboard</Header>
        <ButtonGrid>
          <Button onClick={() => navigate("/register-professor")}>Register a Professor</Button>
          <Button onClick={() => navigate("/import-professors")}>Import Professors</Button>

          <Separator />

          <Button onClick={() => navigate("/create-course")}>Create Course</Button>
          <Button onClick={() => navigate("/import-courses")}>Import Courses</Button>
          <Button onClick={() => navigate("/courses")}>View Courses</Button>

          <Separator />

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </ButtonGrid>
      </Card>
    </PageWrapper>
  );
};

export default Dashboard;
