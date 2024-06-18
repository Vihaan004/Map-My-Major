import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMap } from '../../services/api';

const CreateMap = () => {
  const [mapName, setMapName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await createMap(mapName, token);
      alert('Map created successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to create map:', error);
      alert('Failed to create map');
    }
  };

  return (
    <div>
      <h1>Create New Map</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Map Name"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          required
        />
        <button type="submit">Create Map</button>
      </form>
    </div>
  );
};

export default CreateMap;
