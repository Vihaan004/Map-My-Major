import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMap } from '../../services/api';
import './MapPage.css';

const MapPage = () => {
  const { mapName } = useParams();
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMap = async () => {
      const token = localStorage.getItem('token');
      try {
        console.log('Fetching map:', mapName); // Debugging log
        const res = await getMap(mapName, token);
        console.log('Fetched map:', res.data); // Debugging log
        setMap(res.data);
      } catch (err) {
        console.error('Failed to fetch map:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMap();
  }, [mapName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!map) {
    return <div>Map not found</div>;
  }

  return (
    <div>
      <h1>{map.name}</h1>
      <div className="map-container">
        {map.semesters && map.semesters.map((semester, index) => (
          <div key={semester.id} className="semester-column">
            <h3>Semester {index + 1}</h3>
            {semester.classes && semester.classes.map(classObj => (
              <div key={classObj.id} className="class-card">
                {classObj.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapPage;
