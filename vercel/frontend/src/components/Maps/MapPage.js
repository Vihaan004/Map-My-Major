import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MapPage.css';

const MapPage = () => {
  const { mapName } = useParams();
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMap = async () => {
      // For now, we'll just simulate the fetching process
      setLoading(false);
      setMap({ name: mapName });
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
    </div>
  );
};

export default MapPage;
