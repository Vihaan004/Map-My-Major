import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processAuthCallback = () => {
      try {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if (!token || !userId) {
          setError('Authentication failed. Missing token or user ID.');
          return;
        }

        // Process the authentication
        login(token, userId);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing authentication callback:', error);
        setError('Authentication failed. Please try again.');
      }
    };

    processAuthCallback();
  }, [searchParams, login]);

  if (error) {
    return (
      <div className="auth-callback-error">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <a href="/auth">Return to login page</a>
      </div>
    );
  }

  return isProcessing ? (
    <div className="auth-callback-loading">
      <h2>Completing authentication...</h2>
      <p>Please wait while we complete your sign-in.</p>
    </div>
  ) : (
    <Navigate to="/home" replace />
  );
};

export default AuthCallback;
