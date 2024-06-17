const { Map } = require('../models');

exports.createMap = async (req, res) => {
  try {
    const map = await Map.create({ name: req.body.name, userId: req.userId });
    res.status(201).json(map);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create map' });
  }
};

exports.getMaps = async (req, res) => {
  try {
    const maps = await Map.findAll({ where: { userId: req.userId } });
    res.status(200).json(maps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve maps' });
  }
};

exports.updateMap = async (req, res) => {
  try {
    const map = await Map.findByPk(req.params.id);
    if (!map || map.userId !== req.userId) {
      return res.status(404).json({ error: 'Map not found' });
    }
    map.name = req.body.name;
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
    res.status(500).json({ error: 'Failed to delete map' });
  }
};
