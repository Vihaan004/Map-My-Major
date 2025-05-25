import React, { useState } from 'react';
import './styles/Navbar.css';
import './styles/Requirements.css';

function Navbar({ totalCredits, requirements, setRequirements, calculateRequirementProgress }) {
  const [showModal, setShowModal] = useState(false);
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
    
    // Add the new requirement
    const requirementWithId = { ...newRequirement, id: Date.now() };
    setRequirements([...requirements, requirementWithId]);
    
    // Reset the form
    setNewRequirement({
      name: '',
      tag: '',
      type: 'credits',
      goal: ''
    });
    
    setShowModal(false);
  };
  const deleteRequirement = (id) => {
    setRequirements(requirements.filter(req => req.id !== id));
  };
    const handleGoalChange = (id, newGoal) => {
    // Remove non-numeric characters and validate
    const numericGoal = newGoal.replace(/\D/g, '');
    
    // Only update if there's a valid numeric goal or it's empty
    if (numericGoal !== '' || newGoal === '') {
      setRequirements(
        requirements.map(req => 
          req.id === id ? { ...req, goal: numericGoal } : req
        )
      );
    }
  };
    const handleTotalGoalChange = (newGoal) => {
    // Remove non-numeric characters and validate
    const numericGoal = newGoal.replace(/\D/g, '');
    
    // Only update if there's a valid numeric goal or it's empty
    if (numericGoal !== '' || newGoal === '') {
      setTotalGoal(numericGoal);
      localStorage.setItem('totalGoal', numericGoal);
    }
  };

  return (
    <div className="Navbar">
      <h1 className="title">Map My Major</h1>
      <div className="requirements-container">
        <div className="requirements-title">Requirements:</div>        <div className="requirement-item">
          <div className="requirement-label-container">
            <label className="requirement-label">Total</label>
          </div>          <div className="requirement-box-container">
            <input
              type="text"
              className="current-box"
              readOnly
              value={totalCredits}
            />
            <span className="separator">/</span>
            <input
              type="text"
              className="goal-box"
              placeholder="Set"
              value={totalGoal}
              onChange={(e) => handleTotalGoalChange(e.target.value)}
            />
          </div>
        </div>
        
        {requirements.map((req) => {
          const progress = calculateRequirementProgress(req);
          return (
            <div key={req.id} className="requirement-item">
              <div className="requirement-label-container">
                <label className="requirement-label" title={`${req.name} (${req.tag})`}>
                  {req.name}
                </label>
                <span 
                  className="delete-req" 
                  onClick={() => deleteRequirement(req.id)}
                  title="Delete requirement"
                >×</span>
              </div>
              <div className="requirement-box-container">
                <input
                  type="text"
                  className="current-box"
                  readOnly
                  value={progress.current}
                />
                <span className="separator">/</span>
                <input
                  type="text"
                  className="goal-box"
                  value={req.goal}
                  onChange={(e) => handleGoalChange(req.id, e.target.value)}
                />
              </div>
            </div>
          );
        })}
        
        <div className="add-requirement-button" onClick={() => setShowModal(true)}>+</div>
        
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
