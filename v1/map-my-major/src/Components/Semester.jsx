import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Class from './Class';
import './styles/Semester.css';

function Semester({ index, semester, removeSemester, addClass }) {
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [totalCreditHours, setTotalCreditHours] = useState(0);
  const [creditError, setCreditError] = useState('');

  useEffect(() => {
    const total = semester.classes.reduce((sum, classItem) => sum + parseInt(classItem.creditHours, 10), 0);
    setTotalCreditHours(total);
  }, [semester.classes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (creditHours < 1 || creditHours > 12) {
      setCreditError('Credit hours must be between 1 and 12');
      return;
    }
    const newClass = { className, requirements, creditHours };
    addClass(semester.id, newClass);
    setShowModal(false);
    setClassName('');
    setRequirements('');
    setCreditHours('');
    setCreditError('');
  };

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
      </div>
      {semester.classes.map((classItem, classIndex) => (
        <Class
          key={classIndex}
          className={classItem.className}
          requirements={classItem.requirements}
          creditHours={classItem.creditHours}
        />
      ))}
      <div className="add-class-button" onClick={() => setShowModal(true)}>+</div>
      {showModal && ReactDOM.createPortal(
        <div className="add-class-modal">
          <div className="add-class-modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>New Class Details</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="className">Class Name: *</label>
              <input
                type="text"
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
              <label htmlFor="requirements">Requirements:</label>
              <input
                type="text"
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
              <label htmlFor="creditHours">Credit Hours (1-12): *</label>
              <input
                type="number"
                id="creditHours"
                value={creditHours}
                onChange={(e) => setCreditHours(e.target.value)}
                required
                min="1"
                max="12"
              />
              {creditError && <p className="error">{creditError}</p>}
              <button type="submit" className="add-class-btn">Add Class</button>
            </form>
          </div>
        </div>,
        document.body
      )}
      <div className="semester-footer">
        <div className="footer-box">
          <div className="credit-hours-sum">{totalCreditHours}</div>
        </div>
      </div>
    </div>
  );
}

export default Semester;
