import React, { useState } from 'react';
import './styles/Navbar.css';

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [requirementName, setRequirementName] = useState('');
  const [requirementType, setRequirementType] = useState('Credits');
  const [requirementGoal, setRequirementGoal] = useState('');

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

  return (
    <div className="Navbar">
      <h1 className="title">Map My Major</h1>
      <div className="requirements-container">
        <div className="requirements-title">Requirements:</div>
        {requirements.map((req, index) => (
          <div key={index} className="requirement-item">
            <label>{req.name}</label>
            <div className="requirement-box"></div>
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
                  <option value="credits">Credits</option>
                  <option value="classes">Classes</option>
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




// import React, { useState } from 'react';
// import './styles/Navbar.css';

// function Navbar({ onSetupMap }) {
//   const [showModal, setShowModal] = useState(false);
//   const [startSeason, setStartSeason] = useState('Fall');
//   const [startYear, setStartYear] = useState(new Date().getFullYear());
//   const [numSemesters, setNumSemesters] = useState(8);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSetupMap(startSeason, startYear, numSemesters);
//     setShowModal(false);
//   };

//   return (
//     <div className="Navbar">
//       <h1 className="title">Map My Major</h1>
//       <div className="map-setup">
//         <button className="map-setup-button" onClick={() => setShowModal(true)}>
//           Map Setup
//         </button>
//       </div>
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={() => setShowModal(false)}>&times;</span>
//             <h2>Map Setup</h2>
//             <form onSubmit={handleSubmit}>
//               <label htmlFor="startSeason">Start Season:</label>
//               <select
//                 id="startSeason"
//                 value={startSeason}
//                 onChange={(e) => setStartSeason(e.target.value)}
//               >
//                 <option value="Fall">Fall</option>
//                 <option value="Spring">Spring</option>
//               </select>
//               <label htmlFor="startYear">Start Year:</label>
//               <input
//                 type="number"
//                 id="startYear"
//                 value={startYear}
//                 onChange={(e) => setStartYear(e.target.value)}
//                 required
//               />
//               <label htmlFor="numSemesters">Number of Semesters:</label>
//               <input
//                 type="number"
//                 id="numSemesters"
//                 value={numSemesters}
//                 onChange={(e) => setNumSemesters(e.target.value)}
//                 min="1"
//                 max="12"
//                 required
//               />
//               <button type="submit" className="setup-submit-button">Submit</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Navbar;
