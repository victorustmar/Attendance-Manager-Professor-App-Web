// Make sure to install styled-components: npm install styled-components
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Header = styled.h2`
  color: #1e1e5c;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  background: #999999;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
  &:hover {
    background: #777777;
  }
`;

const ErrorText = styled.p`
  background: #ffd2d2;
  color: #d8000c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h4`
  color: #333333;
  margin: 0.5rem 0;
`;

const InfoText = styled.p`
  color: #555555;
  margin-bottom: 1rem;
`;

const QRImage = styled.img`
  width: 500px;
  height: 500px;
  margin: 1rem auto;
  display: block;
`;

// ************ Component ************
const GenerateQRCode = () => {
  const [qrImage, setQrImage] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "professor") navigate("/");
  }, [navigate, token, role]);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(`${API_BASE}/qr/generate_qr`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQrImage(response.data.qr_image);
        setCourseName(response.data.course_name);
        setLastUpdated(new Date().toLocaleTimeString());
        setError("");
      } catch {
        setError("No active course right now.");
      }
    };
    fetchQRCode();
    const interval = setInterval(fetchQRCode, 10000);
    return () => clearInterval(interval);
  }, [token]);

  if (!token || role !== "professor") return null;

  return (
    <PageWrapper>
      <Card>
        <Header>QR Code Generator</Header>
        <BackButton onClick={() => navigate("/professor-dashboard")}>Back to Dashboard</BackButton>
        {error && <ErrorText>{error}</ErrorText>}
        {!error && (
          <>
            <Subtitle>{courseName ? `Course: ${courseName}` : ""}</Subtitle>
            <InfoText>Last updated: {lastUpdated}</InfoText>
            {qrImage ? (
              <QRImage src={qrImage} alt="QR Code" />
            ) : (
              <InfoText>Loading QR Code...</InfoText>
            )}
          </>
        )}
      </Card>
    </PageWrapper>
  );
};

export default GenerateQRCode;
