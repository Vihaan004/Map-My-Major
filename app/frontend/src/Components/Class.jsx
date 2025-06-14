import React, { useState, useRef, useEffect } from 'react';
import './styles/Class.css';
import editIcon from '../assets/images/edit-icon.svg';
import deleteIcon from '../assets/images/delete.png';

function ClassBox({ className, requirements, creditHours, onClick, onEdit, onDelete, onStatusChange, id, requirementTags, status = 'planned' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleClassBoxClick = (e) => {
    setShowDropdown(!showDropdown);
    e.stopPropagation();
  };
  const handleEditClick = (e) => {
    onEdit({ className: className, name: className, creditHours, requirementTags });
    setShowDropdown(false);
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    onDelete();
    setShowDropdown(false);
    e.stopPropagation();
  };

  const handleStatusChange = (newStatus) => (e) => {
    onStatusChange(newStatus);
    setShowDropdown(false);
    e.stopPropagation();
  };

  // Get class status options excluding current status
  const getStatusOptions = () => {
    const allStatuses = ['planned', 'in-progress', 'complete'];
    return allStatuses.filter(s => s !== status);
  };

  // Helper function to get display text for status
  const getStatusDisplayText = (statusValue) => {
    const displayMap = {
      'planned': 'Planned',
      'in-progress': 'In-Progress',
      'complete': 'Complete'
    };
    return displayMap[statusValue] || statusValue;
  };

  return (
    <div className="classbox-container">
      <div className={`classbox ${status}`} onClick={handleClassBoxClick}>
        <div className="classbox-row left-align">{className}</div>
        <div className="classbox-row left-align requirements-tags">
          {requirements ? requirements : ' '}
        </div>
        <div className="classbox-row right-align credits">{creditHours}</div>
      </div>
      
      {showDropdown && (
        <div className="class-dropdown" ref={dropdownRef}>          {getStatusOptions().map(statusOption => (
            <div 
              key={statusOption} 
              className="dropdown-option" 
              onClick={handleStatusChange(statusOption)}
            >
              <div className={`status-dot ${statusOption}`}></div>
              {getStatusDisplayText(statusOption)}
            </div>
          ))}
          <div className="dropdown-option" onClick={handleEditClick}>
            <img src="/images/edit-icon.svg" alt="edit" className="dropdown-icon" />
            Edit
          </div>
          <div className="dropdown-option" onClick={handleDeleteClick}>
            <img src="/src/assets/images/delete.png" alt="delete" className="dropdown-icon" />
            Delete
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassBox;
