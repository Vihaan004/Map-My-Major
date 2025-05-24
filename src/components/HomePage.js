import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadMaps, saveMaps } from '../utils/storage';
import { sampleCSMap } from '../utils/sampleData';
import { saveMapData } from '../utils/storage';

function HomePage() {
  // State for maps
  const [maps, setMaps] = useState([]);

  // Load maps from local storage on initial render
  useEffect(() => {
    setMaps(loadMaps());
  }, []);

  // Save maps to local storage whenever they change
  useEffect(() => {
    if (maps.length > 0) {
      saveMaps(maps);
    }
  }, [maps]);

  // Create a new map
  const createNewMap = () => {
    const newId = maps.length > 0 ? Math.max(...maps.map(m => m.id)) + 1 : 1;
    setMaps([...maps, { id: newId, name: `Map ${newId}` }]);
  };

  return (
    <div className="App">
      <h1>Major Map Planner</h1>
      <p>Create and visualize your academic journey semester by semester</p>
      <div className="button-group">
        <button onClick={createNewMap}>Create New Map</button>
        <button onClick={() => {
          const newId = maps.length > 0 ? Math.max(...maps.map(m => m.id)) + 1 : 1;
          const newMap = { id: newId, name: sampleCSMap.name };
          setMaps([...maps, newMap]);
          saveMapData(newId, sampleCSMap.semesters, sampleCSMap.requirements);
        }}>Load Sample CS Map</button>
      </div>
      {maps.length === 0 ? (
        <p>No maps created yet. Click the button above to create your first map.</p>
      ) : (
        <ul className="maps-list">
          {maps.map(map => (
            <li key={map.id}>
              <Link to={`/map/${map.id}`} className="map-link">
                {map.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;
