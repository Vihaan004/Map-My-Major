import React, { useState, useEffect } from 'react';
import Semester from './Semester';
import './styles/Map.css';
import './styles/Requirements.css';
import { addSemester as apiAddSemester, updateSemester as apiUpdateSemester, addClass as apiAddClass, updateClass as apiUpdateClass, deleteSemester as apiDeleteSemester, deleteClass as apiDeleteClass, getMap as apiGetMap } from '../services/api';

function Map({ numSemesters, setNumSemesters, setTotalCredits, requirements, setSemesters, semesters = [], mapId, token, onSemesterAdded, onRequirementsUpdate }) {
  const [localSemesters, setLocalSemesters] = useState([]);
  // Initialize semesters from props or fetch from backend
  useEffect(() => {
    if (semesters && semesters.length > 0) {
      setLocalSemesters(semesters);
    } else if (mapId && token) {
      fetchMapData();
    } else {
      initializeSemesters(numSemesters);
    }
  }, [semesters, numSemesters, mapId, token]);

  // Function to fetch map data from backend
  const fetchMapData = async () => {
    try {
      const response = await apiGetMap(mapId, token);
      const mapData = response.data;
      
      if (mapData && mapData.semesters) {
        // Sort semesters by index to ensure correct order
        const sortedSemesters = mapData.semesters.sort((a, b) => a.index - b.index);
        setLocalSemesters(sortedSemesters);
      } else {
        // If no semesters in database, create default ones
        initializeSemesters(numSemesters);
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
      // Fallback to creating default semesters
      initializeSemesters(numSemesters);
    }
  };
  // Sync local state with parent component
  useEffect(() => {
    if (semesters && semesters.length > 0) {
      setLocalSemesters(semesters);
    }
  }, [semesters]);

  useEffect(() => {
    calculateTotalCredits(); // Recalculate total credits whenever semesters change
  }, [localSemesters]);
  
  // Ensure classes have valid requirement tags whenever requirements change
  useEffect(() => {
    if (requirements && localSemesters.length > 0) {
      let hasChanges = false;
      const updatedSemesters = localSemesters.map(semester => {
        const updatedClasses = semester.classes.map(classItem => {
          if (!classItem.requirementTags) return classItem;
          
          // Filter to only tags that exist in current requirements
          const validTags = classItem.requirementTags.filter(tag => 
            requirements.some(req => req.tag === tag)
          );
          
          // If there's a change, update the class
          if (JSON.stringify(validTags) !== JSON.stringify(classItem.requirementTags)) {
            hasChanges = true;
            return {
              ...classItem,
              requirementTags: validTags
            };
          }
          return classItem;
        });
        
        return {
          ...semester,
          classes: updatedClasses
        };
      });
      
      // Only update if there were actually changes
      if (hasChanges) {
        setLocalSemesters(updatedSemesters);
      }
    }
  }, [requirements]);
    const initializeSemesters = (numSemesters) => {
    const initialSemesters = [];
    for (let i = 1; i <= numSemesters; i++) {
      initialSemesters.push(createSemester(i));
    }
    setLocalSemesters(initialSemesters);
  };
  const createSemester = (index) => {
    // Generate a unique ID that won't get reused
    const uniqueId = Date.now() + index;
    return { id: uniqueId, classes: [], name: 'New Sem' };
  };
  
  const [isAddingSemester, setIsAddingSemester] = useState(false);

  const addSemester = async () => {
    if (localSemesters.length < 12) {
      try {
        // Show loading state
        setIsAddingSemester(true);
        
        // Make the API call
        const response = await apiAddSemester(mapId, token);
        console.log("Semester added successfully:", response.data);
        
        // Use the callback to refresh the entire map data
        if (onSemesterAdded) {
          onSemesterAdded();
        }
        
        // Update numSemesters if setNumSemesters was provided
        if (setNumSemesters) {
          setNumSemesters(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error adding semester:', error);
        
        // Provide specific error messages based on the error
        let errorMessage = 'Failed to add semester. Please try again.';
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Your session has expired. Please log in again.';
          } else if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        } else if (error.request) {
          errorMessage = 'Network error. Please check your connection.';
        }
        
        alert(errorMessage);
      } finally {
        // Reset loading state
        setIsAddingSemester(false);
      }
    } else {
      alert('Maximum of 12 semesters reached.');
    }
  };const removeSemester = async (id) => {
    try {
      // Find the semester to delete
      const semesterToDelete = localSemesters.find(sem => sem.id === id);
      if (semesterToDelete && semesterToDelete.id && typeof semesterToDelete.id === 'number') {
        // Try to delete from backend if it has a valid database ID
        await apiDeleteSemester(semesterToDelete.id, token);
      }
      
      // Update local state - backend handles re-indexing automatically
      const updatedSemesters = localSemesters.filter((semester) => semester.id !== id);
      setLocalSemesters(updatedSemesters);
    } catch (error) {
      console.error('Error removing semester:', error);
      // Still update local state even if API call fails
      const updatedSemesters = localSemesters.filter((semester) => semester.id !== id);
      setLocalSemesters(updatedSemesters);
    }
  };
  
  const addClass = async (semesterId, newClass) => {
    try {
      // Find the semester in local state
      const semester = localSemesters.find(sem => sem.id === semesterId);
      if (!semester) {
        console.error('Semester not found for adding class');
        return;
      }

      // Prepare class data for API
      const classData = {
        name: newClass.className,
        creditHours: parseInt(newClass.creditHours, 10),
        credits: parseInt(newClass.creditHours, 10),
        requirementTags: newClass.requirementTags || [],
        requirements: newClass.requirementTags ? newClass.requirementTags.join(', ') : ''
      };      // Only attempt API call if we have a valid semester ID and auth token
      if (semester.id && typeof semester.id === 'number' && token) {
        try {
          const response = await apiAddClass(semester.id, classData, token);
          console.log('Class added successfully:', response.data);
          
          // Update local state with the saved class data that includes DB ID
          const updatedSemesters = localSemesters.map((sem) => {
            if (sem.id === semesterId) {
              return { 
                ...sem, 
                classes: [...sem.classes, response.data] 
              };
            }
            return sem;
          });
          setLocalSemesters(updatedSemesters);
          
          // Refresh requirements to update progress
          if (onRequirementsUpdate) {
            onRequirementsUpdate();
          }
          
          return;
        } catch (error) {
          console.error('API error adding class:', error);
          // Fall through to local handling
        }
      }
      
      // Local fallback (for new semesters not yet saved or if API fails)
      const tempClassWithId = {
        ...newClass,
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      const updatedSemesters = localSemesters.map((sem) => {
        if (sem.id === semesterId) {
          return { ...sem, classes: [...sem.classes, tempClassWithId] };
        }
        return sem;
      });
      setLocalSemesters(updatedSemesters);
      
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };  
  const editClass = async (semesterId, classIndex, updatedClass) => {
    try {
      // Find the semester and class
      const semester = localSemesters.find(sem => sem.id === semesterId);
      if (!semester || !semester.classes[classIndex]) {
        console.error('Class not found for editing');
        return;
      }

      const currentClass = semester.classes[classIndex];

      // Prepare updated class data for API
      const classData = {
        name: updatedClass.className || currentClass.name,
        creditHours: parseInt(updatedClass.creditHours, 10) || currentClass.creditHours,
        credits: parseInt(updatedClass.creditHours, 10) || currentClass.credits,
        requirementTags: updatedClass.requirementTags || currentClass.requirementTags || [],
        requirements: updatedClass.requirementTags ? updatedClass.requirementTags.join(', ') : (currentClass.requirements || '')
      };

      // Try to update in backend if class has a valid database ID
      if (currentClass.id && typeof currentClass.id === 'number') {
        const response = await apiUpdateClass(currentClass.id, classData, token);
        const savedClass = response.data;
        
        // Update local state with the saved class data
        const updatedSemesters = localSemesters.map((sem) => {
          if (sem.id === semesterId) {
            const updatedClasses = [...sem.classes];
            updatedClasses[classIndex] = savedClass;
            return { ...sem, classes: updatedClasses };
          }
          return sem;        });
        setLocalSemesters(updatedSemesters);
        
        // Refresh requirements to update progress
        if (onRequirementsUpdate) {
          onRequirementsUpdate();
        }
      } else {
        // Fallback to local state for classes not yet in database
        const updatedSemesters = localSemesters.map((sem) => {
          if (sem.id === semesterId) {
            const updatedClasses = [...sem.classes];
            updatedClasses[classIndex] = { ...currentClass, ...updatedClass };
            return { ...sem, classes: updatedClasses };
          }
          return sem;
        });
        setLocalSemesters(updatedSemesters);
        
        // Refresh requirements to update progress after fallback
        if (onRequirementsUpdate) {
          onRequirementsUpdate();
        }
      }
    } catch (error) {
      console.error('Error editing class:', error);
      // Fallback to local state if API fails
      const updatedSemesters = localSemesters.map((semester) => {
        if (semester.id === semesterId) {
          const updatedClasses = [...semester.classes];
          updatedClasses[classIndex] = updatedClass;
          return { ...semester, classes: updatedClasses };
        }
        return semester;
      });
      setLocalSemesters(updatedSemesters);
      
      // Refresh requirements to update progress after error fallback
      if (onRequirementsUpdate) {
        onRequirementsUpdate();
      }
    }
  };
  
  const deleteClass = async (semesterId, classIndex) => {
    try {
      // Find the semester and class
      const semester = localSemesters.find(sem => sem.id === semesterId);
      if (!semester || !semester.classes[classIndex]) {
        console.error('Class not found for deletion');
        return;
      }

      const classToDelete = semester.classes[classIndex];
      
      // Try to delete from backend if class has a valid database ID and we have a token
      if (classToDelete.id && typeof classToDelete.id === 'number' && token) {
        try {
          await apiDeleteClass(classToDelete.id, token);
          console.log(`Class with ID ${classToDelete.id} deleted successfully from the database`);
        } catch (error) {
          console.error('API error deleting class:', error);
          // Continue with local deletion even if API fails
        }
      }      // Update local state regardless of API success/failure
      const updatedSemesters = localSemesters.map((sem) => {
        if (sem.id === semesterId) {
          const updatedClasses = sem.classes.filter((_, index) => index !== classIndex);
          return { ...sem, classes: updatedClasses };
        }
        return sem;
      });
      setLocalSemesters(updatedSemesters);
      
      // Refresh requirements to update progress
      if (onRequirementsUpdate) {
        onRequirementsUpdate();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      // Fallback to local deletion if anything fails
      const updatedSemesters = localSemesters.map((sem) => {
        if (sem.id === semesterId) {
          const updatedClasses = sem.classes.filter((_, index) => index !== classIndex);
          return { ...sem, classes: updatedClasses };
        }
        return sem;
      });
      setLocalSemesters(updatedSemesters);
      
      // Refresh requirements to update progress after fallback
      if (onRequirementsUpdate) {
        onRequirementsUpdate();
      }
    }
  };
  
  const calculateTotalCredits = () => {
    const total = localSemesters.reduce((acc, semester) => {
      return (
        acc +
        semester.classes.reduce((semAcc, classItem) => {
          return semAcc + parseInt(classItem.creditHours, 10);
        }, 0)
      );
    }, 0);
    console.log("Total credits updated to: " + total);
    setTotalCredits(total); // Update total credits
  };
  const updateSemester = async (semesterId, updatedData) => {
    try {
      // Find the semester in local state
      const semester = localSemesters.find(sem => sem.id === semesterId);
      if (!semester) {
        console.error('Semester not found for updating');
        return;
      }

      // Try to update in backend if semester has a valid database ID
      if (semester.id && typeof semester.id === 'number') {
        const response = await apiUpdateSemester(semester.id, updatedData, token);
        const savedSemester = response.data;
        
        // Update local state with the saved semester data
        const updatedSemesters = localSemesters.map((sem) => {
          if (sem.id === semesterId) {
            return { ...sem, ...savedSemester };
          }
          return sem;
        });
        setLocalSemesters(updatedSemesters);
      } else {
        // Fallback to local state for new semesters not yet in database
        const updatedSemesters = localSemesters.map((sem) => {
          if (sem.id === semesterId) {
            return { ...sem, ...updatedData };
          }
          return sem;
        });
        setLocalSemesters(updatedSemesters);
      }
    } catch (error) {
      console.error('Error updating semester:', error);
      // Fallback to local state if API fails
      const updatedSemesters = localSemesters.map((semester) => {
        if (semester.id === semesterId) {
          return { ...semester, ...updatedData };
        }
        return semester;
      });
      setLocalSemesters(updatedSemesters);
    }
  };
  
  return (
    <div>
      <div className="map-container">
        {localSemesters.map((semester) => (
          <Semester
            key={semester.id}
            semester={semester}
            removeSemester={removeSemester}
            updateSemester={updateSemester}
            addClass={addClass}
            deleteClass={deleteClass}
            editClass={editClass}
            requirements={requirements}
          />
        ))}
        <div 
          className={`new-semester ${isAddingSemester ? 'loading' : ''}`} 
          onClick={isAddingSemester ? null : addSemester}
        >
          <div id="plus">{isAddingSemester ? '...' : '+'}</div>
        </div>
      </div>
    </div>
  );
}

export default Map;
