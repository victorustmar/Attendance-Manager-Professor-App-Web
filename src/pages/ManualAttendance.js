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
  max-width: 600px;
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
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #777777;
  }
`;

const MessageBox = styled.div`
  background: #eef5ff;
  color: #1e1e5c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
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
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    border-color: #5f3dc4;
    box-shadow: 0 0 0 3px rgba(95, 61, 196, 0.2);
    outline: none;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    border-color: #5f3dc4;
    box-shadow: 0 0 0 3px rgba(95, 61, 196, 0.2);
    outline: none;
  }
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CheckboxInput = styled.input`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  accent-color: #5f3dc4;
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

const ManualAttendance = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || role !== "professor") navigate("/");
  }, [token, role, navigate]);

  useEffect(() => {
    api
      .get(`${API_BASE}/courses/courses`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const mine = res.data.filter(
          (c) => c.professor_id === parseInt(localStorage.getItem("user_id"))
        );
        setCourses(mine);
      })
      .catch(() => setMessage("Failed to load your courses"));
  }, [token]);

  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      setCheckedIds(new Set());
      return;
    }
    api
      .get(
        `${API_BASE}/attendance/manual/eligible_students?course_id=${selectedCourse}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setStudents(res.data);
        setCheckedIds(new Set());
      })
      .catch(() => setMessage("Failed to load students"));
  }, [selectedCourse, token]);

  const toggleStudent = (id) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourse || !date) {
      setMessage("Please pick a course and date");
      return;
    }
    if (checkedIds.size === 0) {
      setMessage("No students selected");
      return;
    }
    api
      .post(
        `${API_BASE}/attendance/manual`,
        { course_id: parseInt(selectedCourse), date, student_ids: Array.from(checkedIds) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setMessage("Manual attendance saved"))
      .catch(() => setMessage("Failed to save"));
  };

  return (
    <PageWrapper>
      <Card>
        <Header>Manual Attendance</Header>
        <BackButton onClick={() => navigate("/professor-dashboard")}>Back to Dashboard</BackButton>

        {message && <MessageBox>{message}</MessageBox>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Course</Label>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">-- select --</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </FormGroup>

          {students.length > 0 && (
            <CheckboxList>
              <Label>Select Students to mark present:</Label>
              {students.map((s) => (
                <CheckboxItem key={s.user_id}>
                  <CheckboxInput
                    type="checkbox"
                    checked={checkedIds.has(s.user_id)}
                    onChange={() => toggleStudent(s.user_id)}
                  />
                  <span>{s.full_name}</span>
                </CheckboxItem>
              ))}
            </CheckboxList>
          )}

          <Button type="submit">Save Attendance</Button>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default ManualAttendance;
