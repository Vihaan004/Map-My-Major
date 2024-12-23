import React, { useState } from 'react';
import Navbar from './Navbar';
import Map from './Map';
import './styles/App.css';

function App() {
  const [numSemesters, setNumSemesters] = useState(8);
  const [totalCredits, setTotalCredits] = useState(0);

  const handleSetupMap = (numSemesters) => {
    setNumSemesters(numSemesters);
  };

  return (
    <div className="App">
      <Navbar totalCredits={totalCredits} />
      <Map numSemesters={numSemesters} setTotalCredits={setTotalCredits} />
    </div>
  );
}

export default App;
