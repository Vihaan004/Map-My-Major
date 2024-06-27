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

const getMaps = async (token) => {
  return axios.get(`${API_URL}/maps`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateMap = async (mapId, newName, token) => {
  return axios.put(
    `${API_URL}/maps/${mapId}`,
    { name: newName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteMap = async (mapId, token) => {
  return axios.delete(`${API_URL}/maps/${mapId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { register, login, createMap, getMaps, updateMap, deleteMap };
