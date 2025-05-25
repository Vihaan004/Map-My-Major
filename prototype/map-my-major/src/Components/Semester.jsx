import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Class from './Class';
import './styles/Semester.css';

function Semester({ index, semester, removeSemester, addClass, deleteClass, deleteMode, requirements, editClass }) {
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState('');
  const [selectedRequirementTags, setSelectedRequirementTags] = useState([]);
  const [creditHours, setCreditHours] = useState('');
  const [totalCreditHours, setTotalCreditHours] = useState(0);
  const [creditError, setCreditError] = useState('');
  const [editingClassIndex, setEditingClassIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    
    const classData = { 
      className, 
      requirementTags: selectedRequirementTags, 
      creditHours 
    };

    if (isEditing && editingClassIndex !== null) {
      // Edit existing class
      editClass(semester.id, editingClassIndex, classData);
    } else {
      // Add new class
      addClass(semester.id, classData);
    }

    // Reset form and state
    setShowModal(false);
    setClassName('');
    setSelectedRequirementTags([]);
    setCreditHours('');
    setCreditError('');
    setEditingClassIndex(null);
    setIsEditing(false);
  };

  const handleTagSelection = (tag) => {
    if (selectedRequirementTags.includes(tag)) {
      setSelectedRequirementTags(selectedRequirementTags.filter(t => t !== tag));
    } else {
      setSelectedRequirementTags([...selectedRequirementTags, tag]);
    }
  };

  const handleEditClass = (classIndex, classData) => {
    setIsEditing(true);
    setEditingClassIndex(classIndex);
    setClassName(classData.className);
    setCreditHours(classData.creditHours);
    setSelectedRequirementTags(classData.requirementTags || []);
    setShowModal(true);
  };

  return (
    <div className="semester">      <div className="semester-head">
        <div className="sem-label-container">          <h2
            className={`sem-label ${deleteMode ? 'delete-mode' : ''}`}
            onClick={deleteMode ? () => removeSemester(semester.id) : null}
          >
            Sem {index + 1}
          </h2>
          <img
            className="delete-semester"
            src="src/assets/images/delete.png"
            alt="delete"
            onClick={() => removeSemester(semester.id)}
          />
        </div>
        <div className="credit-box">
          <div className="credit-hours-sum">{totalCreditHours}</div>
        </div>
      </div>
      {semester.classes.map((classItem, classIndex) => (
        <Class
          key={classIndex}
          id={classIndex}
          className={classItem.className}
          requirements={classItem.requirementTags ? classItem.requirementTags.join(', ') : ''}
          creditHours={classItem.creditHours}
          requirementTags={classItem.requirementTags}
          deleteMode={deleteMode}
          onClick={() => deleteMode && deleteClass(semester.id, classIndex)}
          onEdit={() => handleEditClass(classIndex, classItem)}
          onDelete={() => deleteClass(semester.id, classIndex)}
        />
      ))}
      <div className="add-class-button" onClick={() => {
        setIsEditing(false);
        setEditingClassIndex(null);
        setClassName('');
        setSelectedRequirementTags([]);
        setCreditHours('');
        setShowModal(true);
      }}>+</div>
      {showModal && ReactDOM.createPortal(
        <div className="add-class-modal">
          <div className="add-class-modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{isEditing ? 'Edit Class Details' : 'New Class Details'}</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="className">Class Name: *</label>
              <input
                type="text"
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
              
              {requirements.length > 0 && (
                <div className="form-group">
                  <label>Requirements Satisfied:</label>
                  <div className="tag-selector">
                    {requirements.map(req => (
                      <div 
                        key={req.id} 
                        className={`tag-item ${selectedRequirementTags.includes(req.tag) ? 'selected' : ''}`}
                        onClick={() => handleTagSelection(req.tag)}
                      >
                        {req.name} ({req.tag})
                      </div>
                    ))}
                  </div>
                  <div className="selected-tags">
                    {selectedRequirementTags.length > 0 ? 
                      <p>Selected tags: {selectedRequirementTags.join(', ')}</p> :
                      <p>No tags selected</p>
                    }
                  </div>
                </div>
              )}
              
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
              <button type="submit" className="add-class-btn">
                {isEditing ? 'Save Changes' : 'Add Class'}
              </button>
            </form>
          </div>
        </div>,
        document.body      )}
    </div>
  );
}

export default Semester;
