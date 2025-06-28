// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard'; 
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <Routes>
      {/* Redirect root to login page */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Private routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/executive" element={<ExecutiveDashboard />} />
      <Route path="/officer" element={<OfficerDashboard />} />
      <Route path="/worker" element={<WorkerDashboard />} />
      
      {/* Default redirect if route not found */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
