import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check for auth callback from Google OAuth
  useEffect(() => {
    const checkAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const callbackToken = urlParams.get('token');
      const callbackUserId = urlParams.get('userId');
      
      if (callbackToken && callbackUserId) {
        login(callbackToken, callbackUserId);
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    checkAuthCallback();
  }, []);

  // Check local storage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUser({ id: storedUserId });
      
      // Optionally fetch user profile data
      fetchUserProfile(storedToken, storedUserId);
    }
    setLoading(false);
  }, []);    // Fetch user profile from the backend
  const fetchUserProfile = async (authToken, userId) => {
    try {
      // Handle the case where VITE_API_URL already includes '/api'
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = baseUrl.endsWith('/api') 
        ? baseUrl 
        : `${baseUrl}/api`;
      
      const response = await fetch(`${apiUrl}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = (authToken, userId, userData = null) => {
    console.log('AuthContext login called with:', { authToken, userId });
    localStorage.setItem('token', authToken);
    localStorage.setItem('userId', userId);
    setToken(authToken);
    
    if (userData) {
      setUser(userData);
    } else {
      setUser({ id: userId });
      // Fetch additional user data if not provided
      fetchUserProfile(authToken, userId);
    }
    
    console.log('AuthContext login completed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };  const initiateGoogleLogin = () => {
    // Handle the case where VITE_API_URL already includes '/api'
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') // Remove trailing '/api' if present
      : 'http://localhost:5000';
    window.location.href = `${baseUrl}/api/users/auth/google`;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    initiateGoogleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
