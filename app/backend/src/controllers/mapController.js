const { Map, Semester, Class } = require('../models');

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

exports.getMaps = async (req, res) => {
  try {
    const maps = await Map.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Semester,
          as: 'semesters',
          include: [{ model: Class, as: 'classes' }]
        }
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
      }]
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
  try {
    const map = await Map.findByPk(mapId);
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    const index = await Semester.count({ where: { mapId } }) + 1;
    const semester = await Semester.create({ mapId, index });
    res.status(201).json(semester);
  } catch (error) {
    console.error('Error in addSemester endpoint:', error);
    res.status(500).json({ error: 'Failed to add semester' });
  }
};

exports.addClass = async (req, res) => {
  const { semesterId } = req.params;
  const { name } = req.body;
  try {
    const semester = await Semester.findByPk(semesterId);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    const classCount = await Class.count({ where: { semesterId } });
    const classObj = await Class.create({ semesterId, name, position: classCount + 1 });
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
    await semester.destroy();
    res.status(200).json({ message: 'Semester deleted' });
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
    await classObj.destroy();
    res.status(200).json({ message: 'Class deleted' });
  } catch (error) {
    console.error('Error in deleteClass endpoint:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};
