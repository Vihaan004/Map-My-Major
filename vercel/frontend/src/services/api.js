import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const register = async (userData) => {
  return axios.post(`${API_URL}/users/register`, userData);
};

const login = async (userData) => {
  return axios.post(`${API_URL}/users/login`, userData);
};

const getMaps = async (token) => {
  return axios.get(`${API_URL}/maps`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Add more API methods as needed...

export { register, login, getMaps };
