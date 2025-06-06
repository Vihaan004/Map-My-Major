const { Class, Semester } = require('../models');
const { updateRequirementProgress } = require('./requirementController');

exports.createClass = async (req, res) => {
  try {
    const { semesterId } = req.params;
    
    if (!semesterId) {
      return res.status(400).json({ error: 'Semester ID is required' });
    }

    // Find the semester to get the mapId
    const semester = await Semester.findByPk(semesterId);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }

    const classItem = await Class.create({ 
      name: req.body.name, 
      creditHours: req.body.creditHours || req.body.credits, 
      credits: req.body.credits || req.body.creditHours,
      requirements: req.body.requirements, 
      requirementTags: req.body.requirementTags || [],
      prerequisites: req.body.prerequisites, 
      corequisites: req.body.corequisites, 
      semesterId: semesterId
    });
    
    // Update requirement progress for this map
    await updateRequirementProgress(semester.mapId);
    
    res.status(201).json(classItem);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Failed to create class', details: error.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({ where: { semesterId: req.params.semesterId } });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve classes' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    // Get the semester to find the mapId
    const semester = await Semester.findByPk(classItem.semesterId);
    
    // Update all fields, maintaining backward compatibility
    classItem.name = req.body.name || classItem.name;
    classItem.creditHours = req.body.creditHours || req.body.credits || classItem.creditHours;
    classItem.credits = req.body.credits || req.body.creditHours || classItem.credits;
    classItem.requirements = req.body.requirements || classItem.requirements;
    classItem.requirementTags = req.body.requirementTags || classItem.requirementTags;
    classItem.prerequisites = req.body.prerequisites || classItem.prerequisites;
    classItem.corequisites = req.body.corequisites || classItem.corequisites;
    
    await classItem.save();
    
    // Update requirement progress for this map
    if (semester) {
      await updateRequirementProgress(semester.mapId);
    }
    
    res.status(200).json(classItem);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Failed to update class', details: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    // Get the semester to find the mapId before deleting
    const semester = await Semester.findByPk(classItem.semesterId);
    
    await classItem.destroy();
    
    // Update requirement progress for this map
    if (semester) {
      await updateRequirementProgress(semester.mapId);
    }
    
    res.status(200).json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
};
