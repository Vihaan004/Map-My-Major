import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateMap = () => {
    navigate('/create-map');
  };

  return (
    <div>
      <h1>Welcome to Map-My-Major</h1>
      <button onClick={handleCreateMap}>Create New Map</button>
    </div>
  );
};

export default Home;
