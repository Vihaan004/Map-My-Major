import React from 'react';
import './styles/Navbar.css';

function Navbar() {
  return (
    <div className="Navbar">
      <h1 className="title">Map My Major</h1>
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
