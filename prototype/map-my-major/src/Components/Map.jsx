import React, { useState, useEffect } from 'react';
import Semester from './Semester';
import './styles/Map.css';
import './styles/Requirements.css';

function Map({ numSemesters, setTotalCredits, requirements, setSemesters }) {
  const [localSemesters, setLocalSemesters] = useState([]);

  const [deleteMode, setDeleteMode] = useState(false);

  // Sync local state with parent component
  useEffect(() => {
    if (setSemesters && localSemesters.length > 0) {
      setSemesters(localSemesters);
    }
  }, [localSemesters, setSemesters]);

  useEffect(() => {
    initializeSemesters(numSemesters); // Initialize the semesters based on the given number
  }, [numSemesters]);
  useEffect(() => {
    calculateTotalCredits(); // Recalculate total credits whenever semesters change
  }, [localSemesters]);
  
  // Ensure classes have valid requirement tags whenever requirements change
  useEffect(() => {
    if (requirements && localSemesters.length > 0) {
      let hasChanges = false;
      const updatedSemesters = localSemesters.map(semester => {
        const updatedClasses = semester.classes.map(classItem => {
          if (!classItem.requirementTags) return classItem;
          
          // Filter to only tags that exist in current requirements
          const validTags = classItem.requirementTags.filter(tag => 
            requirements.some(req => req.tag === tag)
          );
          
          // If there's a change, update the class
          if (JSON.stringify(validTags) !== JSON.stringify(classItem.requirementTags)) {
            hasChanges = true;
            return {
              ...classItem,
              requirementTags: validTags
            };
          }
          return classItem;
        });
        
        return {
          ...semester,
          classes: updatedClasses
        };
      });
      
      // Only update if there were actually changes
      if (hasChanges) {
        setLocalSemesters(updatedSemesters);
      }
    }
  }, [requirements]);
  
  const initializeSemesters = (numSemesters) => {
    const initialSemesters = [];
    for (let i = 0; i < numSemesters; i++) {
      initialSemesters.push(createSemester(i));
    }
    setLocalSemesters(initialSemesters);
  };
  
  const createSemester = (index) => {
    // Generate a unique ID that won't get reused
    const uniqueId = Date.now() + index;
    return { id: uniqueId, classes: [], index: index };
  };

  const addSemester = () => {
    if (localSemesters.length < 12) {
      const newSemester = createSemester(localSemesters.length);
      setLocalSemesters([...localSemesters, newSemester]);
    } else {
      alert('Maximum of 12 semesters reached.');
    }
  };

  const removeSemester = (id) => {
    let updatedSemesters = localSemesters.filter((semester) => semester.id !== id);
    // Update the index property for all semesters to maintain order
    updatedSemesters = updatedSemesters.map((semester, idx) => ({
      ...semester,
      index: idx
    }));
    setLocalSemesters(updatedSemesters);
  };
  
  const addClass = (semesterId, newClass) => {
    const updatedSemesters = localSemesters.map((semester) => {
      if (semester.id === semesterId) {
        return { ...semester, classes: [...semester.classes, newClass] };
      }
      return semester;
    });
    setLocalSemesters(updatedSemesters);
  };

  const editClass = (semesterId, classIndex, updatedClass) => {
    const updatedSemesters = localSemesters.map((semester) => {
      if (semester.id === semesterId) {
        const updatedClasses = [...semester.classes];
        updatedClasses[classIndex] = updatedClass;
        return { ...semester, classes: updatedClasses };
      }
      return semester;
    });
    setLocalSemesters(updatedSemesters);
  };

  const deleteClass = (semesterId, classIndex) => {
    const updatedSemesters = localSemesters.map((semester) => {
      if (semester.id === semesterId) {
        const updatedClasses = semester.classes.filter((_, index) => index !== classIndex);
        return { ...semester, classes: updatedClasses };
      }
      return semester;
    });
    setLocalSemesters(updatedSemesters);
  };  
  
  const calculateTotalCredits = () => {
    const total = localSemesters.reduce((acc, semester) => {
      return (
        acc +
        semester.classes.reduce((semAcc, classItem) => {
          return semAcc + parseInt(classItem.creditHours, 10);
        }, 0)
      );
    }, 0);
    console.log("Total credits updated to: " + total);
    setTotalCredits(total); // Update total credits
  };

  return (
    <div>
      <div className="controls">
        <div className="controls-list">
          <div className="control-item">
            <button onClick={() => setDeleteMode(!deleteMode)}>
              Delete Mode<img src="src/assets/images/delete.png" className="control-icon delete-icon"/>
            </button>
          </div>
        </div>
      </div>
      
      <div className="map-container">
        {localSemesters.map((semester) => (
          <Semester
            key={semester.id}
            index={semester.index}
            semester={semester}
            removeSemester={removeSemester}
            addClass={addClass}
            deleteClass={deleteClass}
            editClass={editClass}
            deleteMode={deleteMode}
            requirements={requirements}
          />
        ))}
        <div className="new-semester" onClick={addSemester}>
          <div id="plus">+</div>
        </div>
      </div>
    </div>
  );
}

export default Map;
