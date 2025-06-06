import React, { useState } from 'react';
import { register, login } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(registerData);
      alert('Registration successful. Please log in.');
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      alert('Registration failed');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(loginData);
      alert('Login successful');
      localStorage.setItem('token', res.data.token); // Save token for authentication
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>Authentication</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              placeholder="Username"
              required
            />
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              placeholder="Password"
              required
            />
            <button type="submit">Register</button>
          </form>
        </div>

        <div>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
