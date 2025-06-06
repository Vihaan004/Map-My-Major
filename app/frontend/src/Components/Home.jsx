import React, { useState, useEffect } from 'react';
import { getMaps, createMap, deleteMap } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingMap, setCreatingMap] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const response = await getMaps(token);
      setMaps(response.data);
    } catch (error) {
      setError('Failed to fetch maps');
      console.error('Error fetching maps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMap = async () => {
    setCreatingMap(true);
    try {
      const mapName = `Map ${maps.length + 1}`;
      const response = await createMap(mapName, token);
      setMaps([...maps, response.data]);
    } catch (error) {
      setError('Failed to create map');
      console.error('Error creating map:', error);
    } finally {
      setCreatingMap(false);
    }
  };

  const handleDeleteMap = async (mapId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this map?')) {
      try {
        await deleteMap(mapId, token);
        setMaps(maps.filter(map => map.id !== mapId));
      } catch (error) {
        setError('Failed to delete map');
        console.error('Error deleting map:', error);
      }
    }
  };

  const handleMapClick = (mapId) => {
    navigate(`/map/${mapId}`);
  };

  if (loading) {
    return <div className="loading">Loading your maps...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>My College Maps</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="maps-section">
        <div className="maps-header">
          <h2>Your Maps ({maps.length})</h2>
          <button 
            onClick={handleCreateMap} 
            disabled={creatingMap}
            className="create-map-btn"
          >
            {creatingMap ? 'Creating...' : '+ Create New Map'}
          </button>
        </div>

        {maps.length === 0 ? (
          <div className="no-maps">
            <p>You don't have any maps yet.</p>
            <p>Create your first map to start planning your college program!</p>
          </div>
        ) : (
          <div className="maps-grid">
            {maps.map((map) => (
              <div 
                key={map.id} 
                className="map-card"
                onClick={() => handleMapClick(map.id)}
              >
                <div className="map-card-header">
                  <h3>{map.name}</h3>
                  <button 
                    onClick={(e) => handleDeleteMap(map.id, e)}
                    className="delete-map-btn"
                    title="Delete map"
                  >
                    ×
                  </button>
                </div>
                <div className="map-card-info">
                  <p>Created: {new Date(map.createdAt).toLocaleDateString()}</p>
                  <p>Semesters: {map.semesters?.length || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
