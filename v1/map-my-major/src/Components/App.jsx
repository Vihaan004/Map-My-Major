import React, { useState } from 'react';
import Navbar from './Navbar';
import Controls from './Controls';
import Map from './Map';
import './styles/App.css';

function App() {
  const [mapConfig, setMapConfig] = useState({
    startSeason: 'Fall',
    startYear: new Date().getFullYear(),
    numSemesters: 8,
  });

  const handleSetupMap = (startSeason, startYear, numSemesters) => {
    setMapConfig({ startSeason, startYear, numSemesters });
  };

  return (
    <div className='App'>
      <Navbar onSetupMap={handleSetupMap} />
      <Controls />
      <Map 
        startSeason={mapConfig.startSeason} 
        startYear={mapConfig.startYear} 
        numSemesters={mapConfig.numSemesters} 
      />
    </div>
  );
}

export default App;
