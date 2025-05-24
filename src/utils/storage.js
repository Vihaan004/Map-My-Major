// Helper functions for local storage

// Save maps to local storage
export const saveMaps = (maps) => {
  localStorage.setItem('maps', JSON.stringify(maps));
};

// Load maps from local storage
export const loadMaps = () => {
  const maps = localStorage.getItem('maps');
  return maps ? JSON.parse(maps) : [
    { id: 1, name: 'My Major Map' }
  ];
};

// Save map data (semesters and requirements) to local storage
export const saveMapData = (mapId, semesters, requirements) => {
  localStorage.setItem(`map_${mapId}_semesters`, JSON.stringify(semesters));
  localStorage.setItem(`map_${mapId}_requirements`, JSON.stringify(requirements));
};

// Load semesters for a map from local storage
export const loadSemesters = (mapId) => {
  const semesters = localStorage.getItem(`map_${mapId}_semesters`);
  return semesters ? JSON.parse(semesters) : Array(8).fill().map(() => []);
};

// Load requirements for a map from local storage
export const loadRequirements = (mapId) => {
  const requirements = localStorage.getItem(`map_${mapId}_requirements`);
  return requirements ? JSON.parse(requirements) : [];
};
