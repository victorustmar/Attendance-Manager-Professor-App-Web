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
import PrivateRoute from "./PrivateRoute";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* public */}
        <Route path="/" element={<Login />} />


        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <PrivateRoute requiredRole="admin">
              <CreateCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute requiredRole="admin">
              <CourseList />
            </PrivateRoute>
          }
        />
        <Route
          path="/import-courses"
          element={
            <PrivateRoute requiredRole="admin">
              <ImportCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/register-professor"
          element={
            <PrivateRoute requiredRole="admin">
              <RegisterProfessor />
            </PrivateRoute>
          }
        />
        <Route
          path="/import-professors"
          element={
            <PrivateRoute requiredRole="admin">
              <ImportProfessors />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute requiredRole="professor">
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/generate-qr"
          element={
            <PrivateRoute requiredRole="professor">
              <GenerateQRCode />
            </PrivateRoute>
          }
        />
        <Route
          path="/manual-attendance"
          element={
            <PrivateRoute requiredRole="professor">
              <ManualAttendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/professor-dashboard"
          element={
            <PrivateRoute requiredRole="professor">
              <ProfessorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor-attendance"
          element={
            <PrivateRoute requiredRole="professor">
              <ProfessorAttendance />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};


export default App;
