import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManualAttendance = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  const [courses, setCourses]           = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate]                 = useState('');
  const [students, setStudents]         = useState([]);
  const [checkedIds, setCheckedIds]     = useState(new Set());
  const [message, setMessage]           = useState('');

  // guard: only professors
  useEffect(() => {
    if (!token || role !== 'professor') navigate('/');
  }, [token, role, navigate]);

  // load all courses this prof teaches
  useEffect(() => {
    axios.get('http://192.168.100.35:5000/courses/courses', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // filter to this prof
      const mine = res.data.filter(c => c.professor_id === parseInt(localStorage.getItem('user_id')));
      setCourses(mine);
    })
    .catch(() => setMessage('Failed to load your courses'));
  }, [token]);

  // when course changes, fetch its students
  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      setCheckedIds(new Set());
      return;
    }
    axios.get(`http://127.0.0.1:5000/attendance/manual/eligible_students?course_id=${selectedCourse}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setStudents(res.data);
      setCheckedIds(new Set());
    })
    .catch(() => setMessage('Failed to load students'));
  }, [selectedCourse, token]);

  const toggleStudent = (id) => {
    setCheckedIds(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourse || !date) {
      setMessage('Please pick a course and date');
      return;
    }
    if (checkedIds.size === 0) {
      setMessage('No students selected');
      return;
    }
    axios.post('http://127.0.0.1:5000/attendance/manual',
      {
        course_id: parseInt(selectedCourse),
        date,
        student_ids: Array.from(checkedIds)
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => setMessage('✅ Manual attendance saved'))
    .catch(() => setMessage('❌ Failed to save'));
  };

  return (
    <div className="container mt-5">
      <h2>Manual Attendance</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/professor-dashboard')}>
        ← Back to Dashboard
      </button>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course</label>
          <select
            className="form-control"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">-- select --</option>
            {courses.map(c => (
              <option key={c.course_id} value={c.course_id}>
                {c.course_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mt-3">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        {students.length > 0 && (
          <div className="mt-4">
            <h5>Select Students to mark present:</h5>
            {students.map(s => (
              <div className="form-check" key={s.user_id}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`stu-${s.user_id}`}
                  checked={checkedIds.has(s.user_id)}
                  onChange={() => toggleStudent(s.user_id)}
                />
                <label className="form-check-label" htmlFor={`stu-${s.user_id}`}>
                  {s.full_name}
                </label>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-4">
          Save Attendance
        </button>
      </form>
    </div>
  );
};

export default ManualAttendance;
