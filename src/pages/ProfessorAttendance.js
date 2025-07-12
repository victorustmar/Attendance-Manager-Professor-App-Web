import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import CourseAttendance from "./CourseAttendance";
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
  max-width: 1000px;
`;

const Header = styled.h2`
  color: #1e1e5c;
  margin-bottom: 1rem;
  text-align: center;
`;

const BackButton = styled.button`
  background: #999999;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
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
  text-align: center;
`;

const ListGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ListItem = styled.button`
  padding: 0.75rem 1rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  background: ${(props) => (props.active ? "#5f3dc4" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#333333")};
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: ${(props) => (props.active ? "#4b3399" : "#f1f1f1")};
  }
`;

const ProfessorAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("user_id"), 10);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`${API_BASE}/courses/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const mine = res.data.filter((c) => c.professor_id === userId);
        setCourses(mine);
      })
      .catch(() => setMessage("Failed to load your courses."));
  }, [token, userId]);


const selectedObj = courses.find(c => c.course_id === selectedCourse);

  return (
    <PageWrapper>
      <Card>
        <BackButton onClick={() => navigate("/professor-dashboard")}>Back to Dashboard</BackButton>
        <Header>My Courses</Header>
        {message && <ErrorText>{message}</ErrorText>}

        {!message && (
          <ListGroup>
            {courses.map((c) => {
              const suffix = c.course_type === "Lecture" ? c.series : c.group;
              return (
                <ListItem
                  key={c.course_id}
                  active={selectedCourse === c.course_id}
                  onClick={() => setSelectedCourse(c.course_id)}
                >
                  {c.course_name} ({c.course_type} – {suffix})
                </ListItem>
              );
            })}
          </ListGroup>
        )}

        {selectedCourse && selectedObj && (
  <CourseAttendance
    courseId={selectedCourse}
    token={token}
    courseName={selectedObj.course_name}
    courseType={selectedObj.course_type}
    series={selectedObj.series}
    group={selectedObj.group}
  />
)}

      </Card>
    </PageWrapper>
  );
};

export default ProfessorAttendance;
