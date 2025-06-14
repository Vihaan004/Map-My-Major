import axios from 'axios';

// Set the API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

const getMap = async (mapId, token) => {
  return axios.get(`${API_URL}/maps/id/${mapId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const addSemester = (mapId, token) => {
  return axios.post(`${API_URL}/maps/${mapId}/semesters`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const addClass = async (semesterId, classData, token) => {
  return axios.post(`${API_URL}/semesters/${semesterId}/classes`, classData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateClass = async (classId, classData, token) => {
  return axios.put(`${API_URL}/classes/${classId}`, classData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteSemester = async (semesterId, token) => {
  return axios.delete(`${API_URL}/semesters/${semesterId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteClass = async (classId, token) => {
  return axios.delete(`${API_URL}/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateClassStatus = async (classId, status, token) => {
  return axios.patch(`${API_URL}/classes/${classId}/status`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createRequirement = async (mapId, requirementData, token) => {
  return axios.post(`${API_URL}/maps/${mapId}/requirements`, requirementData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getRequirements = async (mapId, token) => {
  return axios.get(`${API_URL}/maps/${mapId}/requirements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateRequirement = async (requirementId, requirementData, token) => {
  return axios.put(`${API_URL}/requirements/${requirementId}`, requirementData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteRequirement = async (requirementId, token) => {
  return axios.delete(`${API_URL}/requirements/${requirementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateSemester = async (semesterId, semesterData, token) => {
  return axios.put(`${API_URL}/semesters/${semesterId}`, semesterData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { 
  register, 
  login, 
  createMap, 
  getMaps, 
  updateMap, 
  deleteMap, 
  getMap, 
  addSemester, 
  addClass, 
  updateClass,
  updateClassStatus,
  deleteSemester, 
  deleteClass,
  createRequirement,
  getRequirements,
  updateRequirement,
  deleteRequirement,
  updateSemester
};
