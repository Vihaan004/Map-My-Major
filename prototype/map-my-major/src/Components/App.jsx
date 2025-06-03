import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Map from './Map';
import './styles/App.css';

function App() {
  const [numSemesters, setNumSemesters] = useState(8);
  const [totalCredits, setTotalCredits] = useState(0);  
  const [requirements, setRequirements] = useState(() => {
    const savedRequirements = localStorage.getItem('requirements');
    return savedRequirements ? JSON.parse(savedRequirements) : [];
  });  const [semesters, setSemesters] = useState(() => {
    const savedSemesters = localStorage.getItem('semesters');
    return savedSemesters ? JSON.parse(savedSemesters) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('requirements', JSON.stringify(requirements));
  }, [requirements]);
  
  // Save semesters to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('semesters', JSON.stringify(semesters));
  }, [semesters]);

  const handleSetupMap = (numSemesters) => {
    setNumSemesters(numSemesters);
  };  const handleSetRequirements = (newRequirements, deletedTag) => {
    setRequirements(newRequirements);
    
    // If a requirement tag was deleted, remove it from all classes
    if (deletedTag && semesters.length > 0) {
      // Create a completely new semesters array to ensure all references are updated
      const updatedSemesters = semesters.map(semester => {
        let semesterUpdated = false;
        const updatedClasses = semester.classes.map(classItem => {
          // Check if this class has the deleted tag
          if (classItem.requirementTags && classItem.requirementTags.includes(deletedTag)) {
            semesterUpdated = true;
            // Create a new class object with the tag completely removed
            const updatedClass = {
              ...classItem,
              requirementTags: classItem.requirementTags.filter(tag => tag !== deletedTag)
            };
            
            // If no requirement tags left, set to empty array to avoid undefined
            if (!updatedClass.requirementTags.length) {
              updatedClass.requirementTags = [];
            }
            
            return updatedClass;
          }
          return classItem;
        });
        
        // Only update the semester if changes were made to its classes
        return semesterUpdated ? { ...semester, classes: updatedClasses } : semester;
      });
      
      setSemesters(updatedSemesters);
    }
  };  const calculateRequirementProgress = (requirement) => {
    let progress = 0;
    
    if (!semesters.length) return { current: 0, goal: parseInt(requirement.goal, 10) || 0 };
    
    // Ensure we only count classes that have valid requirement tags
    semesters.forEach(semester => {
      semester.classes.forEach(classItem => {
        // Make sure the class has valid requirementTags and it includes this requirement's tag
        if (classItem.requirementTags && 
            Array.isArray(classItem.requirementTags) && 
            classItem.requirementTags.includes(requirement.tag)) {
          
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
        setRequirements={handleSetRequirements}
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
