import React from 'react';
import './styles/Class.css';

function Class({ className, requirements, creditHours, deleteMode, onClick }) {
  return (
    <div className={`classbox ${deleteMode ? 'delete-mode' : ''}`} onClick={onClick}>
      <div className="classbox-row left-align">{className}</div>
      <div className="classbox-row left-align">{requirements || ' '}</div>
      <div className="classbox-row right-align credits">{creditHours}</div>
    </div>
  );
}

export default Class;
