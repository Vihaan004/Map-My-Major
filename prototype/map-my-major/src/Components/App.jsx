import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Map from './Map';
import './styles/App.css';

function App() {
  const [numSemesters, setNumSemesters] = useState(8);
  const [totalCredits, setTotalCredits] = useState(0);  const [requirements, setRequirements] = useState(() => {
    const savedRequirements = localStorage.getItem('requirements');
    return savedRequirements ? JSON.parse(savedRequirements) : [];
  });
  const [semesters, setSemesters] = useState([]);
  
  useEffect(() => {
    localStorage.setItem('requirements', JSON.stringify(requirements));
  }, [requirements]);

  const handleSetupMap = (numSemesters) => {
    setNumSemesters(numSemesters);
  };
  const calculateRequirementProgress = (requirement) => {
    let progress = 0;
    
    if (!semesters.length) return { current: 0, goal: parseInt(requirement.goal, 10) || 0 };
    
    semesters.forEach(semester => {
      semester.classes.forEach(classItem => {
        if (classItem.requirementTags && classItem.requirementTags.includes(requirement.tag)) {
          if (requirement.type === 'credits') {
            progress += parseInt(classItem.creditHours, 10);
          } else if (requirement.type === 'classes') {
            progress += 1;
          }
        }
      });
    });
    
    return { current: progress, goal: parseInt(requirement.goal, 10) || 0 };
  };

  return (
    <div className="App">
      <Navbar 
        totalCredits={totalCredits} 
        requirements={requirements}
        setRequirements={setRequirements}
        calculateRequirementProgress={calculateRequirementProgress}
      />
      <Map 
        numSemesters={numSemesters} 
        setTotalCredits={setTotalCredits} 
        requirements={requirements}
        setSemesters={setSemesters}
      />
    </div>
  );
}

export default App;
