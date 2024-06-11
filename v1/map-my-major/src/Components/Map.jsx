import React, { useState, useEffect } from 'react';
import Semester from './Semester';
import './styles/Map.css';

function Map({ startSeason, startYear, numSemesters }) {
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    initializeSemesters(startSeason, startYear, numSemesters);
  }, [startSeason, startYear, numSemesters]);

  const initializeSemesters = (startSeason, startYear, numSemesters) => {
    const initialSemesters = [];
    for (let i = 0; i < numSemesters; i++) {
      initialSemesters.push(createSemester(i, startSeason, startYear));
    }
    setSemesters(initialSemesters);
  };

  const createSemester = (index, startSeason, startYear) => {
    const season = (index % 2 === 0) ? startSeason : (startSeason === 'Fall' ? 'Spring' : 'Fall');
    const year = startYear + Math.floor(index / 2);
    return { id: index, season, year, classes: [] };
  };

  const addSemester = () => {
    if (semesters.length < 12) {
      const lastSemester = semesters[semesters.length - 1];
      const newSemester = createSemester(semesters.length, lastSemester.season, lastSemester.year);
      setSemesters([...semesters, newSemester]);
    } else {
      alert('Maximum of 12 semesters reached.');
    }
  };

  const removeSemester = (id) => {
    let updatedSemesters = semesters.filter((semester) => semester.id !== id);
    updatedSemesters = updatedSemesters.map((semester, index) => createSemester(index, updatedSemesters[0].season, updatedSemesters[0].year));
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
