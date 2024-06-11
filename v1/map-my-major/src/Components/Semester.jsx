import React from 'react';
import './styles/Semester.css';

function Semester({ index, semester, removeSemester }) {
  return (
    <div className="semester">
      <div className="semester-head">
        <div className="sem-label-container">
          <h2 className="sem-label">Sem {index + 1}</h2>
          <img
            className="delete-semester"
            src="src/assets/images/delete.png"
            alt="delete"
            onClick={() => removeSemester(semester.id)}
          />
        </div>
        <h3 className="sem-name">
          {semester.season} {semester.year}
        </h3>
      </div>
      <div className="add-class-button">+</div>
      <div className="semester-footer">
        <div className="footer-box">
          <div className="credit-hours-sum">0</div>
        </div>
      </div>
    </div>
  );
}

export default Semester;
