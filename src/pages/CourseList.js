import React, { useEffect, useState } from "react";
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
  max-width: 1200px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #1e1e5c;
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

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f4f4f4;
  color: #333333;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
  &:hover {
    background: #f1f1f1;
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  text-align: center;
  border-top: 1px solid #eaeaea;
`;

const DeleteButton = styled.button`
  background: #ff4d4f;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
  &:hover {
    background: #d12c31;
  }
`;

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/");
    } else {
      setIsAuthorized(true);
      api
        .get(`${API_BASE}/courses/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCourses(res.data))
        .catch((err) => console.error("Failed to load courses", err));
    }
  }, [navigate]);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`${API_BASE}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    } catch (error) {
      alert("Failed to delete course.");
      console.error("Error deleting course:", error);
    }
  };

  if (!isAuthorized) return null;

  return (
    <PageWrapper>
      <Card>
        <Title>Course List</Title>
        <BackButton onClick={() => navigate("/dashboard")}>Back to Dashboard</BackButton>

        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Course Name</Th>
                  <Th>Type</Th>
                  <Th>Professor</Th>
                  <Th>Faculty</Th>
                  <Th>Programme</Th>
                  <Th>Year</Th>
                  <Th>Series</Th>
                  <Th>Group</Th>
                  <Th>Day</Th>
                  <Th>Start</Th>
                  <Th>End</Th>
                  <Th>Delete</Th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, i) => (
                  <Tr key={course.course_id}>
                    <Td>{i + 1}</Td>
                    <Td>{course.course_name}</Td>
                    <Td>{course.course_type}</Td>
                    <Td>{course.professor}</Td>
                    <Td>{course.faculty}</Td>
                    <Td>{course.programme}</Td>
                    <Td>{course.year}</Td>
                    <Td>{course.series}</Td>
                    <Td>{course.group}</Td>
                    <Td>{course.day_of_week}</Td>
                    <Td>{course.start_time}</Td>
                    <Td>{course.end_time}</Td>
                    <Td>
                      <DeleteButton onClick={() => handleDelete(course.course_id)}>
                        Delete
                      </DeleteButton>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>
        )}
      </Card>
    </PageWrapper>
  );
};

export default CourseList;
