import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Class from './Class';
import './styles/Semester.css';
import './styles/Requirements.css';

function Semester({ semester, removeSemester, updateSemester, addClass, deleteClass, deleteMode, requirements, editClass }) {
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState('');
  const [selectedRequirementTags, setSelectedRequirementTags] = useState([]);
  const [creditHours, setCreditHours] = useState('');
  const [totalCreditHours, setTotalCreditHours] = useState(0);  const [isEditingName, setIsEditingName] = useState(false);
  const [semesterName, setSemesterName] = useState(semester.name || 'New Sem');
  const [creditError, setCreditError] = useState('');
  const [editingClassIndex, setEditingClassIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);  useEffect(() => {
    const total = semester.classes.reduce((sum, classItem) => sum + parseInt(classItem.creditHours, 10), 0);
    setTotalCreditHours(total);
  }, [semester.classes]);
  
  // Update semester name when semester prop changes
  useEffect(() => {
    setSemesterName(semester.name || 'New Sem');
  }, [semester.name]);
  
  // Effect to check and update classes with stale requirement tags whenever requirements or classes change
  useEffect(() => {
    let hasUpdates = false;
    
    // Check each class for stale requirement tags
    semester.classes.forEach((classItem, classIndex) => {
      if (!classItem.requirementTags) return;
      
      // Get valid tags that still exist in requirements
      const validTags = classItem.requirementTags.filter(tag => 
        requirements.some(req => req.tag === tag)
      );
      
      // If valid tags differ from stored tags, update the class
      if (JSON.stringify(validTags) !== JSON.stringify(classItem.requirementTags)) {
        hasUpdates = true;
        const updatedClass = {
          ...classItem,
          requirementTags: validTags
        };
        editClass(semester.id, classIndex, updatedClass);
      }
    });
    
  }, [requirements, semester.classes, semester.id, editClass]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (creditHours < 1 || creditHours > 12) {
      setCreditError('Credit hours must be between 1 and 12');
      return;
    }
    
    // Filter tags to only include those that still exist in requirements
    const validTags = selectedRequirementTags.filter(tag => 
      requirements.some(req => req.tag === tag)
    );
    
    const classData = { 
      className, 
      requirementTags: validTags, 
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
  };  const handleEditClass = (classIndex, classData) => {
    setIsEditing(true);
    setEditingClassIndex(classIndex);
    setClassName(classData.name || classData.className);
    setCreditHours(classData.creditHours);
    
    // Filter tags to only include those that still exist in requirements
    const validTags = (classData.requirementTags || []).filter(tag => 
      requirements.some(req => req.tag === tag)
    );
    setSelectedRequirementTags(validTags);
    setShowModal(true);
  };

  const handleSemesterNameClick = () => {
    if (!deleteMode) {
      setIsEditingName(true);
    }
  };

  const handleSemesterNameSave = async () => {
    if (semesterName.trim() === '') {
      setSemesterName(semester.name || 'New Sem');
      setIsEditingName(false);
      return;
    }

    try {
      await updateSemester(semester.id, { name: semesterName.trim() });
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update semester name:', error);
      // Revert to original name on error
      setSemesterName(semester.name || 'New Sem');
      setIsEditingName(false);
    }
  };

  const handleSemesterNameCancel = () => {
    setSemesterName(semester.name || 'New Sem');
    setIsEditingName(false);
  };
  const handleSemesterNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSemesterNameSave();
    } else if (e.key === 'Escape') {
      handleSemesterNameCancel();
    }
  };

  return (
    <div className="semester">      <div className="semester-head">
        <div className="sem-label-container">
          {isEditingName ? (
            <input
              type="text"
              className="sem-name-input"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              onBlur={handleSemesterNameSave}
              onKeyDown={handleSemesterNameKeyPress}
              autoFocus
            />
          ) : (
            <h2
              className={`sem-label ${deleteMode ? 'delete-mode' : 'editable'}`}
              onClick={deleteMode ? () => removeSemester(semester.id) : handleSemesterNameClick}
            >
              {semester.name || 'New Sem'}
            </h2>
          )}
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
      </div>{semester.classes.map((classItem, classIndex) => {
        // Filter requirement tags to only include those that still exist in requirements
        const validTags = (classItem.requirementTags || []).filter(tag => 
          requirements.some(req => req.tag === tag)
        );
        
        return (          <Class
            key={classIndex}
            id={classIndex}
            className={classItem.name || classItem.className}
            requirements={validTags.length > 0 ? validTags.join(', ') : ''}
            creditHours={classItem.creditHours}
            requirementTags={validTags}
            deleteMode={deleteMode}
            onClick={() => deleteMode && deleteClass(semester.id, classIndex)}
            onEdit={() => handleEditClass(classIndex, classItem)}
            onDelete={() => deleteClass(semester.id, classIndex)}
          />
        );
      })}
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
