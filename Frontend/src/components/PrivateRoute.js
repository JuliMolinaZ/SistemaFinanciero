// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role, allowedRoles }) => {
  return allowedRoles.includes(role) ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
