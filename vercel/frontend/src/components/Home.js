import React, { useEffect, useState } from 'react';
import { getMaps, createMap, updateMap, deleteMap } from '../services/api';
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
    const mapName = 'New Map';
    const token = localStorage.getItem('token');
    try {
      const res = await createMap(mapName, token);
      setMaps([...maps, res.data]);
    } catch (err) {
      console.error('Failed to create map:', err);
    }
  };

  const handleRenameMap = (mapId) => {
    const map = maps.find(map => map.id === mapId);
    if (map) {
      setEditingMapId(map.id);
      setNewMapName(map.name);
    }
  };

  const handleSaveRename = async (mapId) => {
    if (!newMapName.trim()) {
      alert('Map name cannot be empty. Retaining previous name.');
      setEditingMapId(null);
      return;
    }

    if (maps.some(map => map.name === newMapName && map.id !== mapId)) {
      alert('Map name already exists.');
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

  const handleKeyDown = async (event, mapId) => {
    if (event.key === 'Enter') {
      await handleSaveRename(mapId);
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
                    className='map-rename'
                    type="text"
                    value={newMapName}
                    maxLength="20"
                    onChange={(e) => setNewMapName(e.target.value)}
                    onBlur={() => handleSaveRename(map.id)}
                    onKeyDown={(e) => handleKeyDown(e, map.id)}
                    autoFocus
                  />
                ) : (
                  <h3 className="map-name">{map.name}</h3>
                )}
                <div className="map-actions">
                  <img
                    src={`${process.env.PUBLIC_URL}/icons/rename-icon.svg`}
                    alt="Rename"
                    onClick={() => handleRenameMap(map.id)}
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
