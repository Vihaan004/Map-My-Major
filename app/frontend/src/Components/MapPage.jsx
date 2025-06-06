import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMap, getRequirements, createRequirement, updateRequirement, deleteRequirement } from '../services/api';
import Navbar from './Navbar';
import Map from './Map';
import './styles/App.css';

const MapPage = () => {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [mapData, setMapData] = useState(null);
  const [numSemesters, setNumSemesters] = useState(8);
  const [totalCredits, setTotalCredits] = useState(0);
  const [requirements, setRequirements] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchMapData();
  }, [mapId]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      // Fetch map data and requirements
      const [mapResponse, requirementsResponse] = await Promise.all([
        getMap(mapId, token),
        getRequirements(mapId, token)
      ]);
      
      setMapData(mapResponse.data);
      setRequirements(requirementsResponse.data);
      setSemesters(mapResponse.data.semesters || []);
      setNumSemesters(mapResponse.data.semesters?.length || 8);
      console.log("Map data fetched successfully:", mapResponse.data);
    } catch (error) {
      setError('Failed to load map data');
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  };  const handleSetRequirements = async (newRequirements, deletedTag) => {
    try {
      console.log('handleSetRequirements called with:', { newRequirements, deletedTag });
      
      // Handle requirement updates
      const currentRequirements = requirements;
      
      // Find new requirements to create
      const newReqs = newRequirements.filter(req => 
        !currentRequirements.find(existing => existing.tag === req.tag)
      );
      
      console.log('New requirements to create:', newReqs);
      
      // Find requirements to update
      const updatedReqs = newRequirements.filter(req => {
        const existing = currentRequirements.find(e => e.tag === req.tag);
        return existing && (
          existing.type !== req.type || 
          existing.goal !== req.goal || 
          existing.color !== req.color
        );
      });
      
      console.log('Requirements to update:', updatedReqs);
      
      // Find requirements to delete
      const deletedReqs = currentRequirements.filter(req => 
        !newRequirements.find(newReq => newReq.tag === req.tag)
      );
      
      console.log('Requirements to delete:', deletedReqs);
      
      // Execute API calls
      const apiResults = await Promise.all([
        ...newReqs.map(req => createRequirement(mapId, req, token)),
        ...updatedReqs.map(req => {
          const existing = currentRequirements.find(e => e.tag === req.tag);
          return updateRequirement(existing.id, req, token);
        }),
        ...deletedReqs.map(req => deleteRequirement(req.id, token))
      ]);
      
      console.log('API results:', apiResults);
      
      // If we created new requirements, fetch all requirements again to get the assigned IDs
      if (newReqs.length > 0) {
        console.log('Fetching updated requirements from server');
        const refreshedRequirements = await getRequirements(mapId, token);
        console.log('Refreshed requirements:', refreshedRequirements.data);
        setRequirements(refreshedRequirements.data);
      } else {
        setRequirements(newRequirements);
      }
      
      // Handle tag deletion from classes (same logic as before)
      if (deletedTag && semesters.length > 0) {
        const updatedSemesters = semesters.map(semester => {
          let semesterUpdated = false;
          const updatedClasses = semester.classes.map(classItem => {
            if (classItem.requirementTags && classItem.requirementTags.includes(deletedTag)) {
              semesterUpdated = true;
              const updatedClass = {
                ...classItem,
                requirementTags: classItem.requirementTags.filter(tag => tag !== deletedTag)
              };
              
              if (!updatedClass.requirementTags.length) {
                updatedClass.requirementTags = [];
              }
              
              return updatedClass;
            }
            return classItem;
          });
          
          return semesterUpdated ? { ...semester, classes: updatedClasses } : semester;
        });
        
        setSemesters(updatedSemesters);
      }
    } catch (error) {
      setError('Failed to update requirements');
      console.error('Error updating requirements:', error);
    }
  };  const calculateRequirementProgress = (requirement) => {
    // Use the current value from the backend instead of calculating locally
    return { 
      current: requirement.current || 0, 
      goal: parseInt(requirement.goal, 10) || 0 
    };
  };

  // Function to refresh requirements after class operations
  const refreshRequirements = async () => {
    try {
      console.log('Refreshing requirements after class operation...');
      const response = await getRequirements(mapId, token);
      setRequirements(response.data);
      console.log('Requirements refreshed successfully:', response.data);
    } catch (error) {
      console.error('Error refreshing requirements:', error);
    }
  };
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-message">Loading map...</div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/home')} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }  return (
    <div className="App">
      <Navbar 
        mapName={mapData?.name}
        totalCredits={totalCredits} 
        requirements={requirements}
        setRequirements={handleSetRequirements}
        calculateRequirementProgress={calculateRequirementProgress}
        onNavigateHome={() => navigate('/home')}
        onLogout={logout}
      />
        <Map 
        numSemesters={numSemesters} 
        setNumSemesters={setNumSemesters}
        setTotalCredits={setTotalCredits} 
        requirements={requirements}
        setSemesters={setSemesters}
        semesters={semesters}
        mapId={mapId}
        token={token}
        onSemesterAdded={fetchMapData}
        onRequirementsUpdate={refreshRequirements}
      />
    </div>
  );
};

export default MapPage;
