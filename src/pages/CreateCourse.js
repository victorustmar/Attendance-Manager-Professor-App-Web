import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";
const CreateCourse = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!token || role !== "admin") {
        navigate("/");
      } else {
        setIsAuthorized(true);
      }
  }, [navigate]);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseType, setCourseType] = useState("Lecture");
  const [professors, setProfessors] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [years, setYears] = useState([]);
  const [series, setSeries] = useState([]);
  const [groups, setGroups] = useState([]);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");

  const [message, setMessage] = useState("");

  // Load professors and faculties on mount
  useEffect(() => {

    axios.get(`${API_BASE}/courses/professors`).then((res) => setProfessors(res.data));
    axios.get(`${API_BASE}/auth/faculties`).then((res) => setFaculties(res.data));
  }, []);

  // Fetch programmes when faculty changes
  useEffect(() => {
    if (selectedFaculty) {
      axios
        .get(`${API_BASE}/courses/programmes?faculty_id=${selectedFaculty}`)
        .then((res) => setProgrammes(res.data));
    } else {
      setProgrammes([]);
      setYears([]);
      setSeries([]);
      setGroups([]);
    }
  }, [selectedFaculty]);

  // Fetch years when programme changes
  useEffect(() => {
    if (selectedProgramme) {
      axios
        .get(`${API_BASE}/courses/years?programme_id=${selectedProgramme}`)
        .then((res) => setYears(res.data));
    } else {
      setYears([]);
      setSeries([]);
      setGroups([]);
    }
  }, [selectedProgramme]);

  // Fetch series when year changes
  useEffect(() => {
    if (selectedYear) {
      axios
        .get(`${API_BASE}/courses/series?year_id=${selectedYear}`)
        .then((res) => setSeries(res.data));
    } else {
      setSeries([]);
      setGroups([]);
    }
  }, [selectedYear]);

  // Fetch groups when series changes (only for seminars)
  useEffect(() => {
    if (courseType === "Seminar" && selectedSeries) {
      axios
        .get(`${API_BASE}/courses/groups?series_id=${selectedSeries}`)
        .then((res) => setGroups(res.data));
    } else {
      setGroups([]);
    }
  }, [selectedSeries, courseType]);

  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseName || !courseType || !selectedProfessor || !selectedSeries) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const payload = {
      course_name: courseName,
      course_type: courseType,
      professor_id: selectedProfessor,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    };
    

    if (courseType === "Lecture") {
      payload.series_id = selectedSeries;
    } else if (courseType === "Seminar") {
      if (!selectedGroup) {
        setMessage("Please select a group for the seminar.");
        return;
      }
      payload.group_id = selectedGroup;
    }

    try {
      await axios.post(`${API_BASE}/courses/create_course`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("✅ Course created successfully!");
    } catch (err) {
      setMessage("❌ Error creating course.");
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="container mt-5">
      <h2>Create a New Course</h2>
  <button
    className="btn btn-secondary"
    onClick={() => navigate("/courses")}
  >
    ← Back to Course Listing
  </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <label>Course Name:</label>
          <input
            type="text"
            className="form-control"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Course Type:</label>
          <select
            className="form-control"
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
          >
            <option value="Lecture">Lecture</option>
            <option value="Seminar">Seminar</option>
          </select>
        </div>

        <div className="form-group mt-3">
          <label>Professor:</label>
          <select
            className="form-control"
            value={selectedProfessor}
            onChange={(e) => setSelectedProfessor(e.target.value)}
            required
          >
            <option value="">-- Select Professor --</option>
            {professors.map((prof) => (
              <option key={prof.user_id} value={prof.user_id}>
                {prof.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Dropdowns */}
        <div className="form-group mt-4">
          <label>Faculty:</label>
          <select
            className="form-control"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="">-- Select Faculty --</option>
            {faculties.map((f) => (
              <option key={f.faculty_id} value={f.faculty_id}>
                {f.faculty_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mt-3">
          <label>Study Programme:</label>
          <select
            className="form-control"
            value={selectedProgramme}
            onChange={(e) => setSelectedProgramme(e.target.value)}
            disabled={!selectedFaculty}
          >
            <option value="">-- Select Programme --</option>
            {programmes.map((p) => (
              <option key={p.programme_id} value={p.programme_id}>
                {p.programme_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mt-3">
          <label>Study Year:</label>
          <select
            className="form-control"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedProgramme}
          >
            <option value="">-- Select Year --</option>
            {years.map((y) => (
              <option key={y.year_id} value={y.year_id}>
                {y.year_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mt-3">
          <label>Series:</label>
          <select
            className="form-control"
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            disabled={!selectedYear}
          >
            <option value="">-- Select Series --</option>
            {series.map((s) => (
              <option key={s.series_id} value={s.series_id}>
                {s.series_name}
              </option>
            ))}
          </select>
        </div>

        {courseType === "Seminar" && (
          <div className="form-group mt-3">
            <label>Group:</label>
            <select
              className="form-control"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              disabled={!selectedSeries}
            >
              <option value="">-- Select Group --</option>
              {groups.map((g) => (
                <option key={g.group_id} value={g.group_id}>
                  {g.group_number}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group mt-3">
          <label>Day of the Week:</label>
          <select
            className="form-control"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            required
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mt-3">
          <label>Start Time:</label>
          <input
            type="time"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>End Time:</label>
          <input
            type="time"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>


        <button type="submit" className="btn btn-primary mt-4">
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;