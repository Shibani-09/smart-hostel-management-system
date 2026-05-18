import React from "react";
import { Navigate } from "react-router-dom";

function isTokenValid(token) {
  if (!token) return false;
  try {
    // if token looks like a JWT, try to check exp
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload && payload.exp) {
        // exp is in seconds
        return payload.exp * 1000 > Date.now();
      }
    }
    // Non-JWT tokens: assume valid if present
    return true;
  } catch (err) {
    return false;
  }
}

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  if (!isTokenValid(token)) {
    // token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (requiredRole) {
      if (Array.isArray(requiredRole)) {
        if (!requiredRole.includes(user.role)) {
          return <Navigate to="/" replace />;
        }
      } else {
        if (user.role !== requiredRole) {
          return <Navigate to="/" replace />;
        }
      }
    }

    return children;
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }
}
