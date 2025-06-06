import React, { useState, useEffect, useRef } from 'react';
import './styles/Navbar.css';
import './styles/Requirements.css';

function Navbar({ mapName, totalCredits, requirements, setRequirements, calculateRequirementProgress, onNavigateHome, onLogout }) {  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTotalEditModal, setShowTotalEditModal] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [totalGoal, setTotalGoal] = useState(() => {
    const savedTotalGoal = localStorage.getItem('totalGoal');
    return savedTotalGoal || '';
  });
  const [newRequirement, setNewRequirement] = useState({
    name: '',
    tag: '',
    type: 'credits',
    goal: ''
  });
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle total credits edit dropdown
  const handleTotalCreditsEditClick = (e) => {
    setActiveDropdown(activeDropdown === 'total-credits' ? null : 'total-credits');
    e.stopPropagation();
  };

  const handleEditTotalCredits = () => {
    setShowTotalEditModal(true);
    setActiveDropdown(null);
  };

  const handleTotalEditSubmit = (e) => {
    e.preventDefault();
    
    // Only update if there's a valid numeric goal
    const numericGoal = totalGoal.replace(/\D/g, '');
    if (numericGoal !== '') {
      localStorage.setItem('totalGoal', numericGoal);
    }
    
    setShowTotalEditModal(false);
  };// Handle requirement edit dropdown
  const handleRequirementEditClick = (requirementId, e) => {
    setActiveDropdown(activeDropdown === requirementId ? null : requirementId);
    e.stopPropagation();
  };

  const handleEditRequirement = (requirement) => {
    setEditingRequirement({
      ...requirement,
      originalId: requirement.id
    });
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteRequirement = (requirement) => {
    if (window.confirm(`Delete requirement "${requirement.name}"?`)) {
      deleteRequirement(requirement.id);
    }
    setActiveDropdown(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Validate requirement data
    if (!editingRequirement.name || !editingRequirement.tag || !editingRequirement.goal) {
      alert('Please fill in all fields');
      return;
    }

    // Check if tag is unique (excluding the current requirement)
    const tagExists = requirements.some(req => 
      req.tag === editingRequirement.tag && req.id !== editingRequirement.originalId
    );
    if (tagExists) {
      alert('This tag already exists. Please use a unique tag.');
      return;
    }

    // Update the requirement
    const updatedRequirements = requirements.map(req => 
      req.id === editingRequirement.originalId 
        ? {
            ...req,
            name: editingRequirement.name.trim(),
            tag: editingRequirement.tag.trim(),
            type: editingRequirement.type,
            goal: editingRequirement.goal.toString()
          }
        : req
    );
    
    setRequirements(updatedRequirements, null);
    setShowEditModal(false);
    setEditingRequirement(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate requirement data
    if (!newRequirement.name || !newRequirement.tag || !newRequirement.goal) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if tag is unique
    const tagExists = requirements.some(req => req.tag === newRequirement.tag);
    if (tagExists) {
      alert('This tag already exists. Please use a unique tag.');
      return;
    }
    
    // Create a complete requirement object
    // We don't set the id here as it will be assigned by the database
    const completedRequirement = {
      ...newRequirement,
      name: newRequirement.name.trim(),
      tag: newRequirement.tag.trim(),
      goal: newRequirement.goal.toString()
    };
    
    console.log('Adding new requirement:', completedRequirement);
    
    // Add the new requirement - this will trigger the API call in MapPage.jsx
    setRequirements([...requirements, completedRequirement], null); // null means no tag was deleted
    
    // Reset the form
    setNewRequirement({
      name: '',
      tag: '',
      type: 'credits',
      goal: ''
    });
    
    setShowModal(false);
  };  const deleteRequirement = (id) => {
    // Find the tag of the requirement to be deleted
    const reqToDelete = requirements.find(req => req.id === id);
    if (reqToDelete) {
      // Pass both the filtered requirements and the deleted tag
      const updatedRequirements = requirements.filter(req => req.id !== id);
      setRequirements(updatedRequirements, reqToDelete.tag);
    } else {
      setRequirements(requirements.filter(req => req.id !== id));
    }
  };
  const handleTotalGoalChange = (newGoal) => {
    // Remove non-numeric characters and validate
    const numericGoal = newGoal.replace(/\D/g, '');
    
    // Only update if there's a valid numeric goal or it's empty
    if (numericGoal !== '' || newGoal === '') {
      setTotalGoal(numericGoal);
    }
  };
  return (
    <div className="Navbar">
      <h1 className="title">{mapName || "Map My Major"}</h1>
      <div className="requirements-container">
        {/* <div className="requirements-title">Your Requirements:</div>         */}        <div className="requirement-item">
          <div className="requirement-header">
            <div className="requirement-title">Total Credits</div>
            <div className="requirement-edit-container">
              <img 
                className="requirement-edit-icon"
                src="/images/edit-icon.svg"
                alt="edit"
                onClick={(e) => handleTotalCreditsEditClick(e)}
              />
              
              {activeDropdown === 'total-credits' && (
                <div className="total-credits-dropdown" ref={dropdownRef}>
                  <div className="dropdown-option" onClick={() => handleEditTotalCredits()}>
                    Edit
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="requirement-progress-container">
            <div className="progress-box current-progress">
              {totalCredits}
            </div>
            <div className="progress-separator">of</div>
            <div className="progress-box goal-progress">
              {totalGoal || 'Set'}
            </div>
          </div>
        </div>
          {requirements.map((req) => {
          const progress = calculateRequirementProgress(req);
          return (            <div key={req.id} className="requirement-item">
              <div className="requirement-header">
                <div className="requirement-title" title={`${req.name} (${req.tag})`}>
                  {req.name}
                </div>
                <div className="requirement-edit-container">
                  <img 
                    className="requirement-edit-icon"
                    src="/images/edit-icon.svg"
                    alt="edit"
                    onClick={(e) => handleRequirementEditClick(req.id, e)}
                  />
                  
                  {activeDropdown === req.id && (
                    <div className="requirement-dropdown" ref={dropdownRef}>
                      <div className="dropdown-option" onClick={() => handleEditRequirement(req)}>
                        Edit
                      </div>
                      <div className="dropdown-option" onClick={() => handleDeleteRequirement(req)}>
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="requirement-progress-container">
                <div className="progress-box current-progress">
                  {progress.current}
                </div>
                <div className="progress-separator">of</div>
                <div className="progress-box goal-progress">
                  {req.goal}
                </div>
              </div>
            </div>
          );
        })}        
        <div className="add-requirement-button" onClick={() => setShowModal(true)}>+ Add a Requirement</div>
          {showModal && (
          <div className="add-req-modal">
            <div className="add-req-modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h2>New Requirement</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="requirementName">Requirement Name: *</label>
                <input
                  type="text"
                  id="requirementName"
                  value={newRequirement.name}
                  onChange={(e) => setNewRequirement({...newRequirement, name: e.target.value})}
                  required
                />
                
                <label htmlFor="requirementTag">Tag (unique identifier): *</label>
                <input
                  type="text"
                  id="requirementTag"
                  value={newRequirement.tag}
                  onChange={(e) => setNewRequirement({...newRequirement, tag: e.target.value})}
                  required
                />
                
                <label htmlFor="requirementType">Type:</label>
                <select
                  id="requirementType"
                  value={newRequirement.type}
                  onChange={(e) => setNewRequirement({...newRequirement, type: e.target.value})}
                >
                  <option value="credits">Credits</option>
                  <option value="classes">Classes</option>
                </select>
                
                <label htmlFor="requirementGoal">Goal: *</label>
                <input
                  type="number"
                  id="requirementGoal"
                  value={newRequirement.goal}
                  onChange={(e) => setNewRequirement({...newRequirement, goal: e.target.value})}
                  required
                  min="1"
                />
                
                <button type="submit" className="add-requirement-btn">Add Requirement</button>
              </form>
            </div>
          </div>        )}
        
        {showEditModal && editingRequirement && (
          <div className="edit-req-modal">
            <div className="edit-req-modal-content">
              <span className="close" onClick={() => {
                setShowEditModal(false);
                setEditingRequirement(null);
              }}>&times;</span>
              <h2>Edit Requirement</h2>
              <form onSubmit={handleEditSubmit}>
                <label htmlFor="editRequirementName">Requirement Name: *</label>
                <input
                  type="text"
                  id="editRequirementName"
                  value={editingRequirement.name}
                  onChange={(e) => setEditingRequirement({...editingRequirement, name: e.target.value})}
                  required
                />
                
                <label htmlFor="editRequirementTag">Tag (unique identifier): *</label>
                <input
                  type="text"
                  id="editRequirementTag"
                  value={editingRequirement.tag}
                  onChange={(e) => setEditingRequirement({...editingRequirement, tag: e.target.value})}
                  required
                />
                
                <label htmlFor="editRequirementType">Type:</label>
                <select
                  id="editRequirementType"
                  value={editingRequirement.type}
                  onChange={(e) => setEditingRequirement({...editingRequirement, type: e.target.value})}
                >
                  <option value="credits">Credits</option>
                  <option value="classes">Classes</option>
                </select>
                
                <label htmlFor="editRequirementGoal">Goal: *</label>
                <input
                  type="number"
                  id="editRequirementGoal"
                  value={editingRequirement.goal}
                  onChange={(e) => setEditingRequirement({...editingRequirement, goal: e.target.value})}
                  required
                  min="1"
                />
                
                <button type="submit" className="edit-requirement-btn">Save Changes</button>
              </form>
            </div>
          </div>
        )}
        
        {showTotalEditModal && (
          <div className="edit-req-modal">
            <div className="edit-req-modal-content">
              <span className="close" onClick={() => setShowTotalEditModal(false)}>&times;</span>
              <h2>Edit Total Credits Goal</h2>
              <form onSubmit={handleTotalEditSubmit}>
                <label htmlFor="editTotalGoal">Total Credits Goal: *</label>
                <input
                  type="number"
                  id="editTotalGoal"
                  value={totalGoal}
                  onChange={(e) => handleTotalGoalChange(e.target.value)}
                  required
                  min="1"
                  placeholder="Enter total credits goal"
                />
                
                <button type="submit" className="edit-requirement-btn">Save Changes</button>
              </form>
            </div>
          </div>
        )}
        
        <div className="navbar-navigation">
          <button onClick={onNavigateHome} className="nav-btn back-btn">
            ← Back to Maps
          </button>
          <button onClick={onLogout} className="nav-btn logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
