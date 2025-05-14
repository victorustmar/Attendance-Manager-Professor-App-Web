import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CourseAttendance from "../pages/CourseAttendance"; // from last step
import { API_BASE } from "../api";

const ProfessorAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("user_id"), 10);
  const navigate = useNavigate();  
  useEffect(() => {
    axios
      .get(`${API_BASE}/courses/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // only this professor’s courses
        const mine = res.data.filter(
          (c) => c.professor_id === userId
        );
        setCourses(mine);
      })
      .catch(() => setMessage("Failed to load your courses."));
  }, [token, userId]);

  if (message) return <div className="alert alert-warning">{message}</div>;

  return (
    <div className="container mt-5">
        <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/professor-dashboard")}
      >
        ← Back to Dashboard
      </button>
    <h2>My Courses</h2>
    <div className="list-group mb-4">
      {courses.map((c) => {
        const suffix = c.course_type === "Lecture" ? c.series : c.group;
        return (
          <button
            key={c.course_id}
            className={`list-group-item list-group-item-action ${
              selectedCourse === c.course_id ? "active" : ""
            }`}
            onClick={() => setSelectedCourse(c.course_id)}
          >
            {c.course_name} ({c.course_type} – {suffix})
          </button>
        );
      })}
    </div>

      {selectedCourse && (() => {
        const c = courses.find(c => c.course_id === selectedCourse);
        if (!c) return null;
        return (
        <CourseAttendance
        courseId={c.course_id}
        token={token}
        courseName={c.course_name}
        courseType={c.course_type}
        series={c.series}
        group={c.group}
        />
    );
    })()}
    </div>
  );
};

export default ProfessorAttendance;
