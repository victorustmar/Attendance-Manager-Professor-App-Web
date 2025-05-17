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

const FileInput = styled.input`
  margin-bottom: 1rem;
`;

const Message = styled.div`
  background: #eef5ff;
  color: #1e1e5c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
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
  &:hover {
    background: #777777;
  }
`;

// ************ Component ************
const ImportCourses = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") navigate("/");
  }, [navigate, token, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!file) {
      setMessage("Please select a CSV file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(
        `${API_BASE}/courses/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Courses imported successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to import courses.");
    }
    setFile(null);
    e.target.reset();
  };

  return (
    <PageWrapper>
      <Card>
        <Title>Import Courses from CSV</Title>        
        {message && <Message>{message}</Message>}

        <Form onSubmit={handleSubmit}>
          <FileInput
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button type="submit">Upload Courses</Button>
        </Form>

        <BackButton onClick={() => navigate("/dashboard")}>Back to Dashboard</BackButton>
      </Card>
    </PageWrapper>
  );
};

export default ImportCourses;
