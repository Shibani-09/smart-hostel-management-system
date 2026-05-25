import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard";
import AdminUsers from "./pages/AdminUsers";
import GatePass from "./pages/GatePass";
import Notices from "./pages/Notices";
import Complaint from "./pages/Complaint";
import Rooms from "./pages/Rooms";
import WardenGatePassApproval from "./pages/WardenGatePassApproval";
import WardenComplaints from "./pages/WardenComplaints";
import ProtectedRoute from "./components/ProtectedRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Protected role-based dashboards */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/warden-dashboard" 
          element={
            <ProtectedRoute requiredRole="warden">
              <WardenDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Generic dashboard (redirects based on role on login) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Feature pages (student-accessible with auth check) */}
        <Route 
          path="/gatepass" 
          element={
            <ProtectedRoute requiredRole="student">
              <GatePass />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notices" 
          element={
            <ProtectedRoute>
              <Notices />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/complaint" 
          element={
            <ProtectedRoute requiredRole="student">
              <Complaint />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute requiredRole="admin">
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/gatepass-approval"
          element={
            <ProtectedRoute requiredRole={["warden", "admin"]}>
              <WardenGatePassApproval />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/manage-complaints"
          element={
            <ProtectedRoute requiredRole={["warden", "admin"]}>
              <WardenComplaints />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;