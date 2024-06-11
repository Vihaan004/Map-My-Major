import React, { useState } from 'react';
import Navbar from './Navbar';
import Controls from './Controls';
import Map from './Map';
import './styles/App.css';

function App() {
  const [numSemesters, setNumSemesters] = useState(8);

  const handleSetupMap = (numSemesters) => {
    setNumSemesters(numSemesters);
  };

  return (
    <div className='App'>
      <Navbar />
      <Controls />
      <Map numSemesters={numSemesters} />
    </div>
  );
}

export default App;
