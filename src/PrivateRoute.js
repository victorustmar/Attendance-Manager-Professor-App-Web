import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (!token || role !== requiredRole) {
    // no token or wrong role
    return <Navigate to="/" replace />;
  }

  try {
    const { exp } = jwtDecode(token);
    if (exp * 1000 < Date.now()) {
      // token expired
      localStorage.clear();
      return <Navigate to="/" replace />;
    }
  } catch {
    // invalid token
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
}
