import React, { useState, useEffect } from 'react';
import Semester from './Semester';
import './styles/Map.css';

function Map({ numSemesters, setTotalCredits }) {
  const [semesters, setSemesters] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    initializeSemesters(numSemesters); // Initialize the semesters based on the given number
  }, [numSemesters]);

  useEffect(() => {
    calculateTotalCredits(); // Recalculate total credits whenever semesters change
  }, [semesters]);

  const initializeSemesters = (numSemesters) => {
    const initialSemesters = [];
    for (let i = 0; i < numSemesters; i++) {
      initialSemesters.push(createSemester(i));
    }
    setSemesters(initialSemesters);
  };

  const createSemester = (index) => {
    return { id: index, classes: [] };
  };

  const addSemester = () => {
    if (semesters.length < 12) {
      const newSemester = createSemester(semesters.length);
      setSemesters([...semesters, newSemester]);
    } else {
      alert('Maximum of 12 semesters reached.');
    }
  };

  const removeSemester = (id) => {
    let updatedSemesters = semesters.filter((semester) => semester.id !== id);
    setSemesters(updatedSemesters);
  };

  const addClass = (semesterId, newClass) => {
    const updatedSemesters = semesters.map((semester) => {
      if (semester.id === semesterId) {
        return { ...semester, classes: [...semester.classes, newClass] };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const deleteClass = (semesterId, classIndex) => {
    const updatedSemesters = semesters.map((semester) => {
      if (semester.id === semesterId) {
        const updatedClasses = semester.classes.filter((_, index) => index !== classIndex);
        return { ...semester, classes: updatedClasses };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };

  const calculateTotalCredits = () => {
    const total = semesters.reduce((acc, semester) => {
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
        {semesters.map((semester, index) => (
          <Semester
            key={semester.id}
            index={index}
            semester={semester}
            removeSemester={removeSemester}
            addClass={addClass}
            deleteClass={deleteClass}
            deleteMode={deleteMode}
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
