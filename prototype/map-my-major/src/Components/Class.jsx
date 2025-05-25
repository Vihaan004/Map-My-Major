import React, { useState, useRef, useEffect } from 'react';
import './styles/Class.css';

function ClassBox({ className, requirements, creditHours, deleteMode, onClick, onEdit, onDelete, id, requirementTags }) {
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
    if (deleteMode) {
      onClick();
    } else {
      setShowDropdown(!showDropdown);
    }
    e.stopPropagation();
  };

  const handleEditClick = (e) => {
    onEdit({ className, creditHours, requirementTags });
    setShowDropdown(false);
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    onDelete();
    setShowDropdown(false);
    e.stopPropagation();
  };

  return (
    <div className={`classbox-container ${deleteMode ? 'delete-mode' : ''}`}>
      <div className={`classbox`} onClick={handleClassBoxClick}>
        <div className="classbox-row left-align">{className}</div>
        <div className="classbox-row left-align requirements-tags">
          {requirements ? requirements : ' '}
        </div>
        <div className="classbox-row right-align credits">{creditHours}</div>
      </div>
      
      {showDropdown && !deleteMode && (
        <div className="class-dropdown" ref={dropdownRef}>
          <div className="dropdown-option" onClick={handleEditClick}>
            Edit
          </div>
          <div className="dropdown-option" onClick={handleDeleteClick}>
            Delete
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassBox;
