// src/auth/PrivateRoute.jsx
import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useContext(AuthContext); // Get user context
  const navigate = useNavigate(); // To programmatically navigate

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user doesn't have permission, redirect to unauthorized page
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // If user is authenticated and authorized, render the protected element
  return element;
};

export default PrivateRoute;
