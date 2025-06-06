import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAuth();

  console.log('PrivateRoute check:', { isAuthenticated: isAuthenticated(), loading, user, token });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated() ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
