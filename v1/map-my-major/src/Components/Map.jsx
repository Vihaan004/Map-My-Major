import React, { useState, useEffect } from 'react';
import Semester from './Semester';
import './styles/Map.css';

function Map({ numSemesters }) {
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    initializeSemesters(numSemesters);
  }, [numSemesters]);

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
    updatedSemesters = updatedSemesters.map((semester, index) => createSemester(index));
    setSemesters(updatedSemesters);
  };

  return (
    <div className="map-container">
      {semesters.map((semester, index) => (
        <Semester
          key={semester.id}
          index={index}
          semester={semester}
          removeSemester={removeSemester}
        />
      ))}
      <div className="new-semester" onClick={addSemester}>
        <div id="plus">+</div>
      </div>
    </div>
  );
}

export default Map;
