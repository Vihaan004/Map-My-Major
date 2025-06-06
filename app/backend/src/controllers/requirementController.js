const { Requirement, Map, Semester, Class } = require('../models');

// Function to calculate and update requirement progress for a specific map
const updateRequirementProgress = async (mapId) => {
  try {
    console.log(`Updating requirement progress for map ${mapId}`);
    
    // Get all requirements for this map
    const requirements = await Requirement.findAll({
      where: { mapId }
    });
    
    // Get all classes for this map
    const map = await Map.findByPk(mapId, {
      include: [{
        model: Semester,
        as: 'semesters',
        include: [{ model: Class, as: 'classes' }]
      }]
    });
    
    if (!map) {
      console.log(`Map ${mapId} not found`);
      return;
    }
    
    // Calculate progress for each requirement
    for (const requirement of requirements) {
      let progress = 0;
      
      // Iterate through all classes in all semesters
      map.semesters.forEach(semester => {
        semester.classes.forEach(classItem => {
          if (classItem.requirementTags && 
              Array.isArray(classItem.requirementTags) && 
              classItem.requirementTags.includes(requirement.tag)) {
            
            if (requirement.type === 'credits') {
              progress += parseInt(classItem.creditHours, 10) || 0;
            } else if (requirement.type === 'classes') {
              progress += 1;
            }
          }
        });
      });
      
      // Update the requirement's current progress
      await requirement.update({ current: progress });
      console.log(`Updated requirement ${requirement.tag}: ${progress}/${requirement.goal}`);
    }
  } catch (error) {
    console.error('Error updating requirement progress:', error);
  }
};

exports.createRequirement = async (req, res) => {
  try {
    const { name, tag, type, goal, color } = req.body;
    const { mapId } = req.params;
    
    console.log('Creating requirement:', { name, tag, type, goal, color, mapId });
    
    // Set default values if needed
    const requirementData = {
      name: name || tag, // Use tag as name if name not provided
      tag,
      type: type || 'credits',
      goal: goal || 0,
      color: color || '#007bff', // Default blue color
      mapId
    };
    
    const requirement = await Requirement.create(requirementData);
    
    // Update requirement progress for the whole map after creating new requirement
    await updateRequirementProgress(mapId);
    
    console.log('Requirement created:', requirement.toJSON());
    res.status(201).json(requirement);
  } catch (error) {
    console.error('Error creating requirement:', error);
    res.status(500).json({ error: 'Failed to create requirement', details: error.message });
  }
};

exports.getRequirementsByMap = async (req, res) => {
  try {
    const { mapId } = req.params;
    const requirements = await Requirement.findAll({
      where: { mapId }
    });
    res.json(requirements);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
};

exports.updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tag, type, goal, color } = req.body;
    
    console.log('Updating requirement:', { id, name, tag, type, goal, color });
    
    const requirement = await Requirement.findByPk(id);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    
    await requirement.update({ 
      name: name || requirement.name,
      tag: tag || requirement.tag, 
      type: type || requirement.type, 
      goal: goal !== undefined ? goal : requirement.goal, 
      color: color || requirement.color 
    });
    
    // Update requirement progress for this map after updating requirement
    await updateRequirementProgress(requirement.mapId);
    
    console.log('Requirement updated:', requirement.toJSON());
    res.json(requirement);
  } catch (error) {
    console.error('Error updating requirement:', error);
    res.status(500).json({ error: 'Failed to update requirement', details: error.message });
  }
};

exports.deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const requirement = await Requirement.findByPk(id);
    
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    
    await requirement.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting requirement:', error);
    res.status(500).json({ error: 'Failed to delete requirement' });
  }
};

// Export the utility function for use in other controllers
exports.updateRequirementProgress = updateRequirementProgress;
