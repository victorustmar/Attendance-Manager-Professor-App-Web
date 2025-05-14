import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
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

      axios
        .get(`${API_BASE}/courses/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setCourses(res.data))
        .catch((err) => {
          console.error("Failed to load courses", err);
        });
    }
  }, [navigate]);

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }); 

      // Remove course from UI
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    } catch (error) {
      alert("Failed to delete course.");
      console.error("Error deleting course:", error);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="d-grid gap-1 justify-content align-items-center mb-6">
  <h2>All Courses</h2>
  <div className="text-center my-3">
  <button
    className="btn btn-success mx-2"
    onClick={() => navigate("/create-course")}
  >
    ➕ Create Course
  </button>
  <button
    className="btn btn-secondary mx-2"
    onClick={() => navigate("/dashboard")}
  >
    ← Back to Dashboard
  </button>
</div>


      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="table table-striped table-bordered text-center">
          <thead className="table-light">
            <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Type</th>
                <th>Professor</th>
                <th>Faculty</th>
                <th>Programme</th>
                <th>Year</th>
                <th>Series</th>
                <th>Group</th>
                <th>Day</th>
                <th>Start</th>
                <th>End</th>
                <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course, index) => (
                <tr key={course.course_id}>
                    <td>{index + 1}</td>
                    <td>{course.course_name}</td>
                    <td>{course.course_type}</td>
                    <td>{course.professor}</td>
                    <td>{course.faculty}</td>
                    <td>{course.programme}</td>
                    <td>{course.year}</td>
                    <td>{course.series}</td>
                    <td>{course.group}</td>
                    <td>{course.day_of_week}</td>
                    <td>{course.start_time}</td>
                    <td>{course.end_time}</td>
                    <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(course.course_id)}
                        >
                          🗑️ Delete
                        </button>
                    </td>
                </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};

export default CourseList;
