import React from 'react';
import './styles/Class.css';

function ClassBox({ className, requirements, creditHours }) {
  return (
    <div className="classbox">
      <div className="classbox-row left-align">{className}</div>
      <div className="classbox-row left-align">{requirements || ' '}</div>
      <div className="classbox-row right-align credits">{creditHours}</div>
    </div>
  );
}

export default ClassBox;
