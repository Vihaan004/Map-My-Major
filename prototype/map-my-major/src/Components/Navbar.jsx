import React, { useState } from 'react';
import './styles/Navbar.css';

function Navbar({ totalCredits }) {
  const [showModal, setShowModal] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [requirementName, setRequirementName] = useState('');
  const [requirementType, setRequirementType] = useState('Credits');
  const [requirementGoal, setRequirementGoal] = useState('');
  const [creditGoal, setCreditGoal] = useState(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editingRequirementIndex, setEditingRequirementIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequirement = {
      name: requirementName,
      type: requirementType,
      goal: requirementGoal,
    };
    setRequirements([...requirements, newRequirement]);
    setShowModal(false);
    setRequirementName('');
    setRequirementType('Credits');
    setRequirementGoal('');
  };

  const handleGoalChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCreditGoal(value);
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditingGoal(false);
    }
  };

  const handleRequirementGoalChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const updatedRequirements = requirements.map((req, reqIndex) => {
      if (reqIndex === index) {
        return { ...req, goal: value };
      }
      return req;
    });
    setRequirements(updatedRequirements);
  };

  return (
    <div className="Navbar">
      <h1 className="title">Map My Major</h1>
      <div className="requirements-container">
        <div className="requirements-title">Requirements:</div>
        <div className="requirement-item">
          <label className="requirement-label">Total</label>
          <div className="requirement-box-container">
            <input
              type="text"
              className="current-box"
              readOnly
              value={totalCredits} // Display total credits
            />
            <span className="separator">/</span>
            {isEditingGoal ? (
              <input
                type="number"
                className="goal-box"
                placeholder="Set"
                value={creditGoal || ''}
                onChange={handleGoalChange}
                onBlur={handleGoalChange}
                onKeyPress={handleGoalChange}
                min="0"
              />
            ) : (
              <input
                type="text"
                className="goal-box"
                placeholder="Set"
                value={creditGoal || ''}
                readOnly
                onClick={() => setIsEditingGoal(true)}
              />
            )}
          </div>
        </div>
        {requirements.map((req, index) => (
          <div key={index} className="requirement-item">
            <label className="requirement-label">{req.name}</label>
            <div className="requirement-box-container">
              <input
                type="text"
                className="current-box"
                readOnly
                value={0} // This should be calculated based on actual classes/credits
              />
              <span className="separator">/</span>
              {editingRequirementIndex === index ? (
                <input
                  type="number"
                  className="goal-box"
                  value={req.goal}
                  onChange={(e) => handleRequirementGoalChange(e, index)}
                  onBlur={() => setEditingRequirementIndex(null)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') setEditingRequirementIndex(null);
                  }}
                  min="0"
                />
              ) : (
                <input
                  type="text"
                  className="goal-box"
                  value={req.goal}
                  readOnly
                  onClick={() => setEditingRequirementIndex(index)}
                />
              )}
            </div>
          </div>
        ))}
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
                  value={requirementName}
                  onChange={(e) => setRequirementName(e.target.value)}
                  required
                />
                <label htmlFor="requirementType">Requirement Type:</label>
                <select
                  id="requirementType"
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value)}
                >
                  <option value="Credits">Credits</option>
                  <option value="Classes">Classes</option>
                </select>
                <label htmlFor="requirementGoal">Goal: *</label>
                <input
                  type="number"
                  id="requirementGoal"
                  value={requirementGoal}
                  onChange={(e) => setRequirementGoal(e.target.value)}
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
