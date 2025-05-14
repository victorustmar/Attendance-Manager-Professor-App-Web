import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import RegisterProfessor from "./pages/RegisterProfessor";
import CreateCourse from "./pages/CreateCourse";
import CourseList from "./pages/CourseList";
import ImportCourses from "./pages/ImportCourses";
import ImportProfessors from "./pages/ImportProfessors";
import ChangePassword from "./pages/ChangePassword";
import GenerateQRCode from "./pages/GenerateQRCode";
import ManualAttendance from './pages/ManualAttendance';
import ProfessorAttendance from "./pages/ProfessorAttendance";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/register-professor" element={<RegisterProfessor />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/import-courses" element={<ImportCourses />} />
        <Route path="/import-professors" element={<ImportProfessors />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/generate-qr" element={<GenerateQRCode />} />
        <Route path="/manual-attendance" element={<ManualAttendance />} />
        <Route
        path="/professor-attendance"
        element={<ProfessorAttendance />}
      />
      </Routes>
    </Router>
  );
};

export default App;
