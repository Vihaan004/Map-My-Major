const { Semester, Class } = require('../models');

exports.createSemester = async (req, res) => {
  try {
    const semester = await Semester.create({ index: req.body.index, mapId: req.body.mapId, name: req.body.name || 'New Sem' });
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create semester' });
  }
};

exports.getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.findAll({ 
      where: { mapId: req.params.mapId },
      include: [
        {
          model: Class,
          as: 'classes'
        }
      ],
      order: [
        ['index', 'ASC'],
        [{ model: Class, as: 'classes' }, 'id', 'ASC']
      ]
    });
    res.status(200).json(semesters);
  } catch (error) {
    console.error('Error retrieving semesters:', error);
    res.status(500).json({ error: 'Failed to retrieve semesters', details: error.message });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const semester = await Semester.findByPk(req.params.id);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    semester.index = req.body.index !== undefined ? req.body.index : semester.index;
    semester.name = req.body.name || semester.name;
    await semester.save();
    res.status(200).json(semester);
  } catch (error) {
    console.error('Error updating semester:', error);
    res.status(500).json({ error: 'Failed to update semester', details: error.message });
  }
};

exports.deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findByPk(req.params.id);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    await semester.destroy();
    res.status(200).json({ message: 'Semester deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete semester' });
  }
};
