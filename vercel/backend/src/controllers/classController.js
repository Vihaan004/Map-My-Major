const { Class } = require('../models');

exports.createClass = async (req, res) => {
  try {
    const classItem = await Class.create({ 
      name: req.body.name, 
      credits: req.body.credits, 
      requirements: req.body.requirements, 
      prerequisites: req.body.prerequisites, 
      corequisites: req.body.corequisites, 
      semesterId: req.body.semesterId 
    });
    res.status(201).json(classItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class' });
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
    classItem.name = req.body.name;
    classItem.credits = req.body.credits;
    classItem.requirements = req.body.requirements;
    classItem.prerequisites = req.body.prerequisites;
    classItem.corequisites = req.body.corequisites;
    await classItem.save();
    res.status(200).json(classItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }
    await classItem.destroy();
    res.status(200).json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
};
