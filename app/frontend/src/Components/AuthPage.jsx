import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './styles/Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Form submitted with:', { email: formData.email, isLogin });    try {
      if (isLogin) {
        console.log('Attempting login...');
        const response = await login({
          email: formData.email,
          password: formData.password
        });
        console.log('Login response:', response.data);
        authLogin(response.data.token, response.data.userId);
        console.log('Auth login called successfully');
        // Navigate to home page after successful login
        navigate('/home');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        console.log('Attempting registration...');
        const response = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        console.log('Registration response:', response.data);
        authLogin(response.data.token, response.data.userId);
        // Navigate to home page after successful registration
        navigate('/home');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
