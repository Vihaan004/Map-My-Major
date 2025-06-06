import React, { useState, useEffect, useRef } from 'react';
import { getMaps, createMap, deleteMap, updateMap } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingMap, setCreatingMap] = useState(false);
  // New state for edit functionality
  const [showMapDropdown, setShowMapDropdown] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMap, setEditingMap] = useState(null);
  const [editMapName, setEditMapName] = useState('');
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMapDropdown(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // New handlers for map edit functionality
  const handleMapEditClick = (map, e) => {
    e.stopPropagation();
    setEditingMap(map);
    setEditMapName(map.name);
    setShowEditModal(true);
    setShowMapDropdown(null);
  };  const handleMapDeleteFromDropdown = async (mapId, e) => {
    e.stopPropagation();
    setShowMapDropdown(null);
    
    // Show confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this map? This action cannot be undone.')) {
      try {
        await deleteMap(mapId, token);
        setMaps(maps.filter(map => map.id !== mapId));
      } catch (error) {
        setError('Failed to delete map');
        console.error('Error deleting map:', error);
      }
    }
  };
  const handleEditIconClick = (mapId, e) => {
    e.stopPropagation();
    setShowMapDropdown(showMapDropdown === mapId ? null : mapId);
  };

  const handleMapClick = (mapId) => {
    navigate(`/map/${mapId}`);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editMapName.trim()) {
      alert('Map name cannot be empty');
      return;
    }

    try {
      const response = await updateMap(editingMap.id, editMapName.trim(), token);
      setMaps(maps.map(map => 
        map.id === editingMap.id ? { ...map, name: editMapName.trim() } : map
      ));
      setShowEditModal(false);
      setEditingMap(null);
      setEditMapName('');
    } catch (error) {
      setError('Failed to update map name');
      console.error('Error updating map:', error);
    }
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
                  <div className="map-actions">
                    <img 
                      className="map-edit-icon"
                      src="/images/edit-icon.svg"
                      alt="edit"
                      onClick={(e) => handleEditIconClick(map.id, e)}
                      title="Edit or delete map"
                    />
                    
                    {showMapDropdown === map.id && (
                      <div className="map-dropdown" ref={dropdownRef}>
                        <div className="dropdown-option" onClick={(e) => handleMapEditClick(map, e)}>
                          Edit
                        </div>
                        <div className="dropdown-option" onClick={(e) => handleMapDeleteFromDropdown(map.id, e)}>
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
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

      {/* Edit map modal */}
      {showEditModal && editingMap && (
        <div className="edit-map-modal">
          <div className="edit-map-modal-content">
            <span className="close" onClick={() => {
              setShowEditModal(false);
              setEditingMap(null);
              setEditMapName('');
            }}>&times;</span>
            <h2>Edit Map Name</h2>
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="editMapName">Map Name: *</label>
              <input
                type="text"
                id="editMapName"
                value={editMapName}
                onChange={(e) => setEditMapName(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" className="edit-map-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
