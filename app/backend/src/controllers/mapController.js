const { Map, Semester, Class } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;
const { updateRequirementProgress } = require('./requirementController');

exports.createMap = async (req, res) => {
  try {
    const map = await Map.create({ name: req.body.name || 'New Map', userId: req.userId });
    console.log(`-----MAP CREATED: ${map.name} by user ${req.userId}`);

    // Create 8 default semesters
    const semesters = [];
    for (let i = 1; i <= 8; i++) {
      const semester = await Semester.create({ mapId: map.id, index: i });
      semesters.push(semester);
    }

    res.status(201).json({ ...map.toJSON(), semesters });
  } catch (error) {
    console.error('Error in createMap endpoint:', error);
    res.status(500).json({ error: 'Failed to create map' });
  }
};

exports.getMaps = async (req, res) => {  try {
    const maps = await Map.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Semester,
          as: 'semesters',
          include: [{ model: Class, as: 'classes' }]
        }
      ],
      order: [
        [{ model: Semester, as: 'semesters' }, 'index', 'ASC']
      ]
    });
    res.status(200).json(maps);
  } catch (error) {
    console.error('Error in getMaps endpoint:', error);
    res.status(500).json({ error: 'Failed to retrieve maps' });
  }
};

exports.getMapByName = async (req, res) => {
  const { name } = req.params;
  try {
    const map = await Map.findOne({ 
      where: { name, userId: req.userId },
      include: [{
        model: Semester,
        as: 'semesters',
        include: [{ model: Class, as: 'classes' }]
      }],
      order: [
        [{ model: Semester, as: 'semesters' }, 'index', 'ASC']
      ]
    });
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    res.status(200).json(map);
  } catch (error) {
    console.error('Error in getMapByName endpoint:', error);
    res.status(500).json({ error: 'Failed to retrieve map' });
  }
};

exports.getMapById = async (req, res) => {
  const { id } = req.params;
  try {
    const map = await Map.findOne({ 
      where: { id, userId: req.userId },
      include: [{
        model: Semester,
        as: 'semesters',
        include: [{ model: Class, as: 'classes' }]
      }],
      order: [
        [{ model: Semester, as: 'semesters' }, 'index', 'ASC']
      ]
    });
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    res.status(200).json(map);
  } catch (error) {
    console.error('Error in getMapById endpoint:', error);
    res.status(500).json({ error: 'Failed to retrieve map' });
  }
};

exports.updateMap = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!name.trim()) {
      return res.status(400).json({ error: 'Map name cannot be empty' });
    }

    const existingMap = await Map.findOne({ where: { name, userId: req.userId } });
    if (existingMap) {
      return res.status(400).json({ error: 'Map name already exists' });
    }

    const map = await Map.findByPk(id);
    if (!map || map.userId !== req.userId) {
      return res.status(404).json({ error: 'Map not found' });
    }
    map.name = name;
    await map.save();
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update map' });
  }
};

exports.deleteMap = async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.id);
    if (!map || map.userId !== req.userId) {
      return res.status(404).json({ error: 'Map not found' });
    }
    await map.destroy();
    res.status(200).json({ message: 'Map deleted' });
  } catch (error) {
    res.status500.json({ error: 'Failed to delete map' });
  }
};

exports.addSemester = async (req, res) => {
  const { mapId } = req.params;
  const { name } = req.body;
  try {
    // Validate map ownership
    const map = await Map.findOne({ 
      where: { 
        id: mapId,
        userId: req.userId 
      }
    });
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found or you do not have permission to access it' });
    }
    
    // Calculate the index for the new semester
    const index = await Semester.count({ where: { mapId } }) + 1;
    
    // Create the new semester
    const semester = await Semester.create({ 
      mapId, 
      index, 
      name: name || 'New Sem' 
    });
    
    res.status(201).json(semester);
  } catch (error) {
    console.error('Error in addSemester endpoint:', error);
    res.status(500).json({ error: 'Failed to add semester' });
  }
};

exports.addClass = async (req, res) => {
  const { semesterId } = req.params;
  const { name, creditHours, credits, requirements, requirementTags, prerequisites, corequisites } = req.body;
  try {
    const semester = await Semester.findByPk(semesterId);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    const classCount = await Class.count({ where: { semesterId } });
    const classObj = await Class.create({ 
      semesterId, 
      name, 
      creditHours: creditHours || credits || 3,
      credits: credits || creditHours || 3,
      requirements,
      requirementTags: requirementTags || [],
      prerequisites,
      corequisites,
      position: classCount + 1 
    });
    
    // Update requirement progress for this map
    await updateRequirementProgress(semester.mapId);
    
    res.status(201).json(classObj);
  } catch (error) {
    console.error('Error in addClass endpoint:', error);
    res.status(500).json({ error: 'Failed to add class' });
  }
};

exports.deleteSemester = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const semester = await Semester.findByPk(semesterId);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    
    const mapId = semester.mapId;
    const deletedIndex = semester.index;
    
    // Delete the semester
    await semester.destroy();
    
    // Re-index all remaining semesters with index greater than the deleted one
    await Semester.update(
      { index: sequelize.literal('index - 1') },
      { 
        where: { 
          mapId: mapId,
          index: { [Op.gt]: deletedIndex }
        }
      }
    );
    
    res.status(200).json({ message: 'Semester deleted and indices updated' });
  } catch (error) {
    console.error('Error in deleteSemester endpoint:', error);
    res.status(500).json({ error: 'Failed to delete semester' });
  }
};

exports.deleteClass = async (req, res) => {
  const { classId } = req.params;
  try {
    const classObj = await Class.findByPk(classId);
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    // Get the semester to find the mapId before deleting
    const semester = await Semester.findByPk(classObj.semesterId);
    
    await classObj.destroy();
    
    // Update requirement progress for this map
    if (semester) {
      await updateRequirementProgress(semester.mapId);
    }
    
    res.status(200).json({ message: 'Class deleted' });
  } catch (error) {
    console.error('Error in deleteClass endpoint:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

exports.updateClass = async (req, res) => {
  const { classId } = req.params;
  const { name, creditHours, credits, requirements, requirementTags, prerequisites, corequisites } = req.body;
  try {
    const classObj = await Class.findByPk(classId);
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    // Get the semester to find the mapId
    const semester = await Semester.findByPk(classObj.semesterId);
    
    await classObj.update({
      name: name || classObj.name,
      creditHours: creditHours || credits || classObj.creditHours,
      credits: credits || creditHours || classObj.credits,
      requirements: requirements !== undefined ? requirements : classObj.requirements,
      requirementTags: requirementTags !== undefined ? requirementTags : classObj.requirementTags,
      prerequisites: prerequisites !== undefined ? prerequisites : classObj.prerequisites,
      corequisites: corequisites !== undefined ? corequisites : classObj.corequisites
    });
    
    // Update requirement progress for this map
    if (semester) {
      await updateRequirementProgress(semester.mapId);
    }
    
    res.status(200).json(classObj);
  } catch (error) {
    console.error('Error in updateClass endpoint:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

exports.updateSemester = async (req, res) => {
  const { semesterId } = req.params;
  const { name } = req.body;
  try {
    const semester = await Semester.findByPk(semesterId);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    
    await semester.update({
      name: name !== undefined ? name : semester.name
    });
    
    res.status(200).json(semester);
  } catch (error) {
    console.error('Error in updateSemester endpoint:', error);
    res.status(500).json({ error: 'Failed to update semester' });
  }
};
