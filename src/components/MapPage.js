import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  saveMapData, 
  loadSemesters, 
  loadRequirements,
  loadMaps
} from '../utils/storage';
import { commonRequirements, detectRequirements } from '../utils/requirements';

// Class card component
function ClassCard({ classData, onMoveClass, onDeleteClass, onEditClass, requirements }) {
  // State for context menu and edit form
  const [showMenu, setShowMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Determine class type for color coding
  let classType = ""; // default is green
  
  // Check course level by course number (if it exists)
  const courseNumber = parseInt(classData.name.match(/\\d+/)?.[0] || 0);
  
  if (classData.name.toLowerCase().includes('elective') || 
      classData.name.startsWith('FSE') || 
      courseNumber >= 400) {
    // Advanced/upper division courses (400+ level) get yellow color
    classType = "advanced";
  } else if (classData.name.toLowerCase().includes('hon') || 
             classData.name.toLowerCase().includes('thesis')) {
    // Electives get blue color
    classType = "elective";
  }
  
  // Handle right click for context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    // Toggle between edit form and move menu
    if (e.altKey) {
      setShowMenu(true);
      
      // Close menu when clicking elsewhere
      const closeMenu = () => {
        setShowMenu(false);
        document.removeEventListener('click', closeMenu);
      };
      
      document.addEventListener('click', closeMenu);
    } else {
      setShowEditForm(true);
      
      // Close form when clicking elsewhere
      const closeForm = () => {
        setShowEditForm(false);
        document.removeEventListener('click', closeForm);
      };
      
      document.addEventListener('click', closeForm);
    }
  };
  
  return (
    <>
      <div className={`class-card ${classType}`} 
          title="Right-click: Edit class | Alt+Right-click: Move/delete | Double-click: Quick move"
          onContextMenu={handleContextMenu}
          onDoubleClick={() => {
            const target = window.prompt("Move to semester (1-8):", "");
            if (target && !isNaN(target) && target >= 1 && target <= 8) {
              onMoveClass(classData, parseInt(target) - 1);
            }
          }}>
        <h4>{classData.name}</h4>
        {classData.requirements.length > 0 && (
          <p className="req-tags">{classData.requirements.join(', ')}</p>
        )}
        <div className="credits">{classData.credits}</div>
        
        {/* Context menu for moving classes */}
        {showMenu && (
          <div className="class-context-menu">
            <div className="menu-title">Move to semester:</div>
            {Array(8).fill().map((_, i) => (
              <div 
                key={i} 
                className="menu-item"
                onClick={() => onMoveClass(classData, i)}
              >
                Semester {i + 1}
              </div>
            ))}
            <div className="menu-divider"></div>
            <div 
              className="menu-item delete-item"
              onClick={() => {
                if (window.confirm(`Delete ${classData.name}?`)) {
                  onDeleteClass(classData);
                }
              }}
            >
              Delete Class
            </div>
          </div>
        )}
      </div>
      
      {/* Edit form in modal */}
      {showEditForm && (
        <div className="modal" onClick={(e) => {
          // Close modal when clicking on the background (not the content)
          if (e.target === e.currentTarget) {
            setShowEditForm(false);
          }
        }}>
          <div className="modal-content">
            <ClassEditForm 
              classData={classData}
              requirements={requirements}
              onSave={(updatedClass) => {
                onEditClass(classData, updatedClass);
                setShowEditForm(false);
              }}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Class edit form component
function ClassEditForm({ classData, requirements, onSave, onCancel }) {
  const [className, setClassName] = useState(classData.name);
  const [classTitle, setClassTitle] = useState(classData.title || '');
  const [credits, setCredits] = useState(classData.credits);
  const [selectedReqs, setSelectedReqs] = useState(classData.requirements || []);
  const [prerequisites, setPrerequisites] = useState(
    (classData.prerequisites || []).join(', ')
  );

  // Handle click outside to close the modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    onSave({
      name: className,
      title: classTitle,
      credits: parseInt(credits),
      requirements: selectedReqs,
      prerequisites: prerequisites.split(',').map(p => p.trim()).filter(p => p)
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Edit Class</h3>
      <div className="form-group">
        <label>Class Code</label>
        <input 
          type="text" 
          placeholder="e.g. CSE 310" 
          value={className}
          required
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          placeholder="e.g. Data Structures & Algorithms" 
          value={classTitle}
          required
          onChange={(e) => setClassTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Credits</label>
        <input 
          type="number" 
          min="1" 
          max="6" 
          value={credits}
          required
          onChange={(e) => setCredits(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Requirements</label>
        <select 
          multiple
          value={selectedReqs}
          onChange={(e) => {
            const options = [...e.target.selectedOptions];
            setSelectedReqs(options.map(option => option.value));
          }}
        >
          {requirements.map(req => (
            <option key={req.tag} value={req.tag}>
              {req.name} ({req.tag})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Prerequisites (comma separated)</label>
        <input 
          type="text" 
          placeholder="e.g. CSE 240, MAT 265" 
          value={prerequisites}
          onChange={(e) => setPrerequisites(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}>Cancel</button>
      </div>
    </form>
  );
}

// Class form component
function ClassForm({ requirements, onAddClass, onCancel }) {
  const [className, setClassName] = useState('');
  const [classTitle, setClassTitle] = useState('');
  const [credits, setCredits] = useState(3);
  const [selectedReqs, setSelectedReqs] = useState([]);
  const [prerequisites, setPrerequisites] = useState('');
  // Auto-detect requirements when class name changes
  useEffect(() => {
    if (className && requirements.length > 0) {
      const detectedTags = detectRequirements(className, classTitle);
      // Filter to tags that exist in our requirements
      const validTags = detectedTags.filter(tag => 
        requirements.some(req => req.tag === tag)
      );
      if (validTags.length > 0) {
        setSelectedReqs(validTags);
      }
    }
  }, [className, classTitle, requirements]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClass({
      name: className,
      title: classTitle,
      credits: parseInt(credits),
      requirements: selectedReqs,
      prerequisites: prerequisites.split(',').map(p => p.trim()).filter(p => p)
    });
    // Reset form
    setClassName('');
    setClassTitle('');
    setCredits(3);
    setSelectedReqs([]);
    setPrerequisites('');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Add a Class</h3>
      <div className="form-group">
        <label>Class Code</label>
        <input 
          type="text" 
          placeholder="e.g. CSE 310" 
          value={className}
          required
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          placeholder="e.g. Data Structures & Algorithms" 
          value={classTitle}
          required
          onChange={(e) => setClassTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Credits</label>
        <input 
          type="number" 
          min="1" 
          max="6" 
          value={credits}
          required
          onChange={(e) => setCredits(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Requirements</label>
        <select 
          multiple
          value={selectedReqs}
          onChange={(e) => {
            const options = [...e.target.selectedOptions];
            setSelectedReqs(options.map(option => option.value));
          }}
        >
          {requirements.map(req => (
            <option key={req.tag} value={req.tag}>
              {req.name} ({req.tag})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Prerequisites (comma separated)</label>
        <input 
          type="text" 
          placeholder="e.g. CSE 240, MAT 265" 
          value={prerequisites}
          onChange={(e) => setPrerequisites(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button type="submit">Add Class</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// Requirement form component
function RequirementForm({ onAddRequirement, onCancel }) {
  const [reqName, setReqName] = useState('');
  const [reqTag, setReqTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRequirement({
      name: reqName,
      tag: reqTag
    });
    // Reset form
    setReqName('');
    setReqTag('');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Add a Requirement</h3>
      <div className="form-group">
        <label>Requirement Name</label>
        <input 
          type="text" 
          placeholder="e.g. Humanities" 
          value={reqName}
          required
          onChange={(e) => setReqName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Tag</label>
        <input 
          type="text" 
          placeholder="e.g. HU" 
          value={reqTag}
          required
          onChange={(e) => setReqTag(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button type="submit">Add Requirement</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function MapPage() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  
  // State for map data
  const [mapName, setMapName] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddRequirement, setShowAddRequirement] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [targetSemester, setTargetSemester] = useState(0);

  // Load map data on initial render
  useEffect(() => {
    const maps = loadMaps();
    const currentMap = maps.find(map => map.id === parseInt(mapId));
    
    if (!currentMap) {
      // Map not found, redirect to home
      navigate('/');
      return;
    }
    
    setMapName(currentMap.name);
    setNewMapName(currentMap.name);
    
    const loadedSemesters = loadSemesters(parseInt(mapId));
    setSemesters(loadedSemesters);
    setRequirements(loadRequirements(parseInt(mapId)));
    
    // Initialize semester names (either from saved data or default names)
    const loadedNames = localStorage.getItem(`map_${mapId}_semester_names`);
    if (loadedNames) {
      setSemesterNames(JSON.parse(loadedNames));
    } else {
      // Create default semester names
      const defaultNames = loadedSemesters.map((_, idx) => `Semester ${idx + 1}`);
      setSemesterNames(defaultNames);
    }
  }, [mapId, navigate]);

  // Save semesters and requirements to local storage whenever they change
  useEffect(() => {
    if (semesters.length > 0 && mapId) {
      saveMapData(parseInt(mapId), semesters, requirements);
    }
  }, [mapId, semesters, requirements]);

  // Handle updating map name
  const handleUpdateMapName = (newName) => {
    const maps = loadMaps();
    const updatedMaps = maps.map(map => 
      map.id === parseInt(mapId) ? { ...map, name: newName } : map
    );
    localStorage.setItem('maps', JSON.stringify(updatedMaps));
    setMapName(newName);
    setShowEditName(false);
  };

  // Add a requirement
  const handleAddRequirement = (requirement) => {
    setRequirements([...requirements, requirement]);
    setShowAddRequirement(false);
  };

  // Add a class to a semester
  const handleAddClass = (classData) => {
    const newSemesters = [...semesters];
    newSemesters[targetSemester] = [...newSemesters[targetSemester], classData];
    setSemesters(newSemesters);
    setShowAddClass(false);
  };

  // Move a class from one semester to another
  const handleMoveClass = (classData, targetSemesterIndex) => {
    // Find the semester and class index
    let sourceSemesterIndex = -1;
    let sourceClassIndex = -1;

    for (let i = 0; i < semesters.length; i++) {
      const classIndex = semesters[i].findIndex(c => 
        c.name === classData.name && c.title === classData.title
      );
      
      if (classIndex !== -1) {
        sourceSemesterIndex = i;
        sourceClassIndex = classIndex;
        break;
      }
    }

    if (sourceSemesterIndex !== -1 && sourceClassIndex !== -1) {
      // Create a new semesters array
      const newSemesters = [...semesters];
      
      // Remove the class from source semester
      const [movedClass] = newSemesters[sourceSemesterIndex].splice(sourceClassIndex, 1);
      
      // Add the class to target semester
      newSemesters[targetSemesterIndex] = [...newSemesters[targetSemesterIndex], movedClass];
      
      // Update the state
      setSemesters(newSemesters);
    }
  };
  
  // Delete a class
  const handleDeleteClass = (classData) => {
    // Find the semester and class index
    for (let i = 0; i < semesters.length; i++) {
      const classIndex = semesters[i].findIndex(c => 
        c.name === classData.name && c.title === classData.title
      );
      
      if (classIndex !== -1) {
        // Create a new semesters array
        const newSemesters = [...semesters];
        
        // Remove the class from the semester
        newSemesters[i].splice(classIndex, 1);
        
        // Update the state
        setSemesters(newSemesters);
        break;
      }
    }
  };

  // Edit a class
  const handleEditClass = (oldClassData, updatedClassData) => {
    // Find the semester and class index
    for (let i = 0; i < semesters.length; i++) {
      const classIndex = semesters[i].findIndex(c => 
        c.name === oldClassData.name && c.title === oldClassData.title
      );
      
      if (classIndex !== -1) {
        // Create a new semesters array
        const newSemesters = [...semesters];
        
        // Update the class in the semester
        newSemesters[i][classIndex] = updatedClassData;
        
        // Update the state
        setSemesters(newSemesters);
        break;
      }
    }
  };

  // Save map name
  const handleSaveMapName = (e) => {
    e.preventDefault();
    handleUpdateMapName(newMapName);
  };
  
  // Handle semester name editing
  const handleSemesterNameEdit = (index) => {
    setEditingSemesterIndex(index);
    setEditingSemesterName(semesterNames[index]);
  };
  
  // Save semester name
  const handleSaveSemesterName = (index) => {
    const newNames = [...semesterNames];
    newNames[index] = editingSemesterName || `Semester ${index + 1}`;
    setSemesterNames(newNames);
    setEditingSemesterIndex(-1);
    
    // Save to localStorage
    localStorage.setItem(`map_${mapId}_semester_names`, JSON.stringify(newNames));
  };
  
  // Handle key press in semester name input
  const handleSemesterNameKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleSaveSemesterName(index);
    } else if (e.key === 'Escape') {
      setEditingSemesterIndex(-1);
    }
  };

  // Calculate total credits
  const totalCredits = semesters.reduce((total, semester) => {
    return total + semester.reduce((semTotal, cls) => semTotal + cls.credits, 0);
  }, 0);

  // State for semester names (initialized in useEffect)
  const [semesterNames, setSemesterNames] = useState([]);
  const [editingSemesterIndex, setEditingSemesterIndex] = useState(-1);
  const [editingSemesterName, setEditingSemesterName] = useState("");
  
  // Calculate upper division credits (300-400 level courses)
  const upperDivisionCredits = semesters.reduce((total, semester) => {
    return total + semester.reduce((semTotal, cls) => {
      // Extract course number from class name (e.g., CSE 310 -> 310)
      const courseNumber = parseInt(cls.name.match(/\\d+/)?.[0] || 0);
      return semTotal + (courseNumber >= 300 ? cls.credits : 0);
    }, 0);
  }, 0);

  // Count credits by requirement tag
  const creditsByRequirement = {};
  requirements.forEach(req => {
    creditsByRequirement[req.tag] = 0;
  });
  // Calculate credits for each requirement
  semesters.forEach(semester => {
    semester.forEach(cls => {
      cls.requirements.forEach(tag => {
        if (creditsByRequirement[tag] !== undefined) {
          creditsByRequirement[tag] += cls.credits;
        }
      });
    });
  });

  return (
    <div className="MapPage">
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
      
      <div className="main-content">
        <div className="map-header">
          <h2>{mapName}</h2>
          <button className="edit-name-button" onClick={() => setShowEditName(true)}>
            Edit Name
          </button>
        </div>

        {/* Semesters grid */}
        <div className="semesters-grid">
          {semesters.map((classes, idx) => {
            const semesterCredits = classes.reduce((total, cls) => total + cls.credits, 0);
            
            return (
              <div className="semester" key={idx}>
                <div className="semester-header">
                  <div className="semester-top">
                    <div className="semester-number">{idx + 1}</div>
                    
                    {editingSemesterIndex === idx ? (
                      <input
                        type="text"
                        className="semester-name"
                        value={editingSemesterName}
                        onChange={(e) => setEditingSemesterName(e.target.value)}
                        onBlur={() => handleSaveSemesterName(idx)}
                        onKeyDown={(e) => handleSemesterNameKeyPress(e, idx)}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="semester-name"
                        onClick={() => handleSemesterNameEdit(idx)}
                        title="Click to edit semester name"
                      >
                        {semesterNames[idx] || `Semester ${idx + 1}`}
                      </div>
                    )}
                  </div>
                  
                  <div className="semester-credits">
                    {semesterCredits} credits
                  </div>
                </div>
                
                {/* List classes */}
                <div className="class-list">
                  {classes.map((cls, cidx) => (
                    <ClassCard 
                      key={cidx} 
                      classData={cls} 
                      requirements={requirements}
                      onMoveClass={handleMoveClass}
                      onDeleteClass={handleDeleteClass}
                      onEditClass={handleEditClass}
                    />
                  ))}
                  <button
                    className="add-class-button"
                    onClick={() => {
                      setTargetSemester(idx);
                      setShowAddClass(true);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="sidebar">
        {/* Controls */}
        <div className="controls">
          <button onClick={() => setShowAddRequirement(true)}>Add Requirement</button>
          {requirements.length === 0 && (
            <button 
              onClick={() => setRequirements(commonRequirements)}
              title="Load common general education requirements"
            >
              Load Common Requirements
            </button>
          )}
        </div>
        
        {/* Requirements section */}
        <div className="requirements-section">
          <h3>Requirements</h3>
          
          {requirements.length === 0 ? (
            <p>No requirements added yet. Add requirements to track your progress.</p>
          ) : (
            <>
              {/* Group requirements by category */}
              <div className="requirement-box">
                <h4>General Studies Requirements</h4>
                {requirements
                  .filter(req => ['HU', 'SB', 'SQ', 'SG', 'C', 'G', 'H', 'L'].includes(req.tag))
                  .map((req, ridx) => (
                    <div className="requirement-stat" key={ridx}>
                      <div className="requirement-stat-left">{req.name} ({req.tag})</div>
                      <div className="requirement-stat-right">{creditsByRequirement[req.tag]}</div>
                    </div>
                  ))}
              </div>

              {/* Other requirements */}
              {requirements
                .filter(req => !['HU', 'SB', 'SQ', 'SG', 'C', 'G', 'H', 'L'].includes(req.tag))
                .length > 0 && (
                <div className="requirement-box">
                  <h4>Major Requirements</h4>
                  {requirements
                    .filter(req => !['HU', 'SB', 'SQ', 'SG', 'C', 'G', 'H', 'L'].includes(req.tag))
                    .map((req, ridx) => (
                      <div className="requirement-stat" key={ridx}>
                        <div className="requirement-stat-left">{req.name} ({req.tag})</div>
                        <div className="requirement-stat-right">{creditsByRequirement[req.tag]}</div>
                      </div>
                    ))}
                </div>
              )}
              
              {/* Upper Division Credits */}
              <div className="requirement-box">
                <h4>Upper Division Credits (Required: 45)</h4>
                <div className="requirement-stat">
                  <div className="requirement-stat-left">300-400 level courses</div>
                  <div className="requirement-stat-right">{upperDivisionCredits}</div>
                </div>
              </div>
              
              {/* Total Credits */}
              <div className="requirement-box">
                <h4>Total Credits (Required: 120)</h4>
                <div className="requirement-stat credits-total">
                  <div className="requirement-stat-left">All courses</div>
                  <div className="requirement-stat-right">{totalCredits}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add requirement form */}
      {showAddRequirement && (
        <div className="modal" onClick={(e) => {
          // Close modal when clicking on the background (not the content)
          if (e.target === e.currentTarget) {
            setShowAddRequirement(false);
          }
        }}>
          <div className="modal-content">
            <RequirementForm 
              onAddRequirement={handleAddRequirement}
              onCancel={() => setShowAddRequirement(false)}
            />
          </div>
        </div>
      )}

      {/* Add class form */}
      {showAddClass && (
        <div className="modal" onClick={(e) => {
          // Close modal when clicking on the background (not the content)
          if (e.target === e.currentTarget) {
            setShowAddClass(false);
          }
        }}>
          <div className="modal-content">
            <ClassForm 
              requirements={requirements}
              onAddClass={handleAddClass}
              onCancel={() => setShowAddClass(false)}
            />
          </div>
        </div>
      )}

      {/* Edit map name form */}
      {showEditName && (
        <div className="modal" onClick={(e) => {
          // Close modal when clicking on the background (not the content)
          if (e.target === e.currentTarget) {
            setShowEditName(false);
          }
        }}>
          <div className="modal-content">
            <form className="form" onSubmit={handleSaveMapName}>
              <h3>Edit Map Name</h3>
              <div className="form-group">
                <label>Map Name</label>
                <input 
                  type="text" 
                  value={newMapName}
                  required
                  onChange={(e) => setNewMapName(e.target.value)}
                />
              </div>
              <div className="button-group">
                <button type="submit">Save</button>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  setShowEditName(false);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapPage;
