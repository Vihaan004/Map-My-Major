import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const register = async (userData) => {
  return axios.post(`${API_URL}/users/register`, userData);
};

const login = async (userData) => {
  return axios.post(`${API_URL}/users/login`, userData);
};

const createMap = async (mapName, token) => {
  return axios.post(
    `${API_URL}/maps`,
    { name: mapName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Add more API methods as needed...

export { register, login, createMap };
