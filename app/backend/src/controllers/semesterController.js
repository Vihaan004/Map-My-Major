const { Semester } = require('../models');

exports.createSemester = async (req, res) => {
  try {
    const semester = await Semester.create({ index: req.body.index, mapId: req.body.mapId });
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create semester' });
  }
};

exports.getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.findAll({ where: { mapId: req.params.mapId } });
    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve semesters' });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const semester = await Semester.findByPk(req.params.id);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    semester.index = req.body.index;
    await semester.save();
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update semester' });
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
