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
  width: 100%;
  max-width: 600px;
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e1e5c;
`;

const BackButton = styled.button`
  background: #999999;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  &:hover {
    background: #777777;
  }
`;

const Message = styled.div`
  background: #eef5ff;
  color: #1e1e5c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: #333333;
  font-size: 1rem;
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #ffffff;
  &:focus {
    border-color: #5f3dc4;
    box-shadow: 0 0 0 3px rgba(95, 61, 196, 0.2);
    outline: none;
  }
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

// ************ Component ************
const CreateCourse = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseType, setCourseType] = useState("Lecture");
  const [professors, setProfessors] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [years, setYears] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [groups, setGroups] = useState([]);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/");
    } else {
      setIsAuthorized(true);
      axios.get(`${API_BASE}/courses/professors`).then(res => setProfessors(res.data));
      axios.get(`${API_BASE}/auth/faculties`).then(res => setFaculties(res.data));
    }
  }, [navigate, token, role]);

  useEffect(() => {
    if (selectedFaculty) {
      axios.get(`${API_BASE}/courses/programmes?faculty_id=${selectedFaculty}`).then(res => setProgrammes(res.data));
    } else {
      setProgrammes([]);
      setYears([]);
      setSeriesList([]);
      setGroups([]);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    if (selectedProgramme) {
      axios.get(`${API_BASE}/courses/years?programme_id=${selectedProgramme}`).then(res => setYears(res.data));
    } else {
      setYears([]);
      setSeriesList([]);
      setGroups([]);
    }
  }, [selectedProgramme]);

  useEffect(() => {
    if (selectedYear) {
      axios.get(`${API_BASE}/courses/series?year_id=${selectedYear}`).then(res => setSeriesList(res.data));
    } else {
      setSeriesList([]);
      setGroups([]);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (courseType === "Seminar" && selectedSeries) {
      axios.get(`${API_BASE}/courses/groups?series_id=${selectedSeries}`).then(res => setGroups(res.data));
    } else {
      setGroups([]);
    }
  }, [selectedSeries, courseType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || !selectedProfessor || !selectedSeries) {
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
    } else {
      if (!selectedGroup) {
        setMessage("Please select a group for the seminar.");
        return;
      }
      payload.group_id = selectedGroup;
    }
    try {
      await axios.post(`${API_BASE}/courses/create_course`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Course created successfully!");
    } catch {
      setMessage("Error creating course.");
    }
  };

  if (!isAuthorized) return null;

  return (
    <PageWrapper>
      <Card>
        <BackButton onClick={() => navigate("/dashboard")}>Back to Dashboard</BackButton>
        <Header>Create a New Course</Header>
        {message && <Message>{message}</Message>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Course Name</Label>
            <Input value={courseName} onChange={e => setCourseName(e.target.value)} required />
          </FormGroup>

          <FormGroup>
            <Label>Course Type</Label>
            <Select value={courseType} onChange={e => setCourseType(e.target.value)}>
              <option value="Lecture">Lecture</option>
              <option value="Seminar">Seminar</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Professor</Label>
            <Select value={selectedProfessor} onChange={e => setSelectedProfessor(e.target.value)} required>
              <option value="">-- Select Professor --</option>
              {professors.map(prof => <option key={prof.user_id} value={prof.user_id}>{prof.full_name}</option>)}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Faculty</Label>
            <Select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)}>
              <option value="">-- Select Faculty --</option>
              {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name}</option>)}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Study Programme</Label>
            <Select value={selectedProgramme} onChange={e => setSelectedProgramme(e.target.value)} disabled={!selectedFaculty}> 
              <option value="">-- Select Programme --</option>
              {programmes.map(p => <option key={p.programme_id} value={p.programme_id}>{p.programme_name}</option>)}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Study Year</Label>
            <Select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={!selectedProgramme}>
              <option value="">-- Select Year --</option>
              {years.map(y => <option key={y.year_id} value={y.year_id}>{y.year_name}</option>)}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Series</Label>
            <Select value={selectedSeries} onChange={e => setSelectedSeries(e.target.value)} disabled={!selectedYear}>
              <option value="">-- Select Series --</option>
              {seriesList.map(s => <option key={s.series_id} value={s.series_id}>{s.series_name}</option>)}
            </Select>
          </FormGroup>

          {courseType === "Seminar" && (
            <FormGroup>
              <Label>Group</Label>
              <Select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} disabled={!selectedSeries}>
                <option value="">-- Select Group --</option>
                {groups.map(g => <option key={g.group_id} value={g.group_id}>{g.group_number}</option>)}
              </Select>
            </FormGroup>
          )}

          <FormGroup>
            <Label>Day of the Week</Label>
            <Select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} required>
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => <option key={day} value={day}>{day}</option>)}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Start Time</Label>
            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </FormGroup>

          <FormGroup>
            <Label>End Time</Label>
            <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </FormGroup>

          <Button type="submit">Create Course</Button>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default CreateCourse;
