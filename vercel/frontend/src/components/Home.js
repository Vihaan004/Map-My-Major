import React, { useEffect, useState, useRef } from 'react';
import { getMaps, createMap, updateMap, deleteMap } from '../services/api'; // Corrected path
import './Home.css';

const Home = () => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMapId, setEditingMapId] = useState(null);
  const [newMapName, setNewMapName] = useState('');
  
  useEffect(() => {
    const fetchMaps = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await getMaps(token);
        setMaps(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch maps:', err);
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  const handleCreateMap = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await createMap('', token);
      setMaps([...maps, res.data]);
      setEditingMapId(res.data.id);
    } catch (err) {
      console.error('Failed to create map:', err);
    }
  };

  const handleRenameMap = async (mapId) => {
    const map = maps.find(map => map.id === mapId);

    if (!newMapName.trim()) {
      if (!map.name) {
        await handleDeleteMap(mapId);
        alert('Map name cannot be empty.');
      } else {
        alert('Map name cannot be empty. Retaining previous name.');
        setNewMapName(map.name);
      }
      setEditingMapId(null);
      return;
    }

    if (maps.some(map => map.name === newMapName)) {
      alert('Map name already exists.');
      if (!map.name) {
        await handleDeleteMap(mapId);
      }
      setEditingMapId(null);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await updateMap(mapId, newMapName, token);
      const updatedMaps = maps.map(map => map.id === mapId ? { ...map, name: newMapName } : map);
      setMaps(updatedMaps);
      setEditingMapId(null);
      setNewMapName('');
    } catch (err) {
      console.error('Failed to rename map:', err);
    }
  };

  const handleDeleteMap = async (mapId) => {
    const token = localStorage.getItem('token');
    try {
      await deleteMap(mapId, token);
      const updatedMaps = maps.filter(map => map.id !== mapId);
      setMaps(updatedMaps);
    } catch (err) {
      console.error('Failed to delete map:', err);
    }
  };

  return (
    <div>
      <h1>Welcome to Map-My-Major</h1>
      <button onClick={handleCreateMap}>New Map</button>
      {loading ? (
        <p>Loading maps...</p>
      ) : (
        <div className="map-grid">
          {maps.map((map) => (
            <div key={map.id} className="map-card">
              <div className="map-card-header">
                {editingMapId === map.id ? (
                  <input
                    type="text"
                    value={newMapName}
                    onChange={(e) => setNewMapName(e.target.value)}
                    onBlur={() => handleRenameMap(map.id)}
                    autoFocus
                  />
                ) : (
                  <h3>{map.name || 'New Map'}</h3>
                )}
                <div className="map-actions">
                  <img
                    src={`${process.env.PUBLIC_URL}/icons/rename-icon.svg`}
                    alt="Rename"
                    onClick={() => { setEditingMapId(map.id); setNewMapName(map.name); }}
                    className="action-icon"
                  />
                  <img
                    src={`${process.env.PUBLIC_URL}/icons/delete-icon.svg`}
                    alt="Delete"
                    onClick={() => handleDeleteMap(map.id)}
                    className="action-icon"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
