const { Map } = require('../models');

exports.createMap = async (req, res) => {
  try {
    const map = await Map.create({ name: 'New Map', userId: req.userId });
    console.log(`-----MAP CREATED: ${map.name} by user ${req.userId}`);
    res.status(201).json(map);
  } catch (error) {
    console.error('Error in createMap endpoint:', error);
    res.status(500).json({ error: 'Failed to create map' });
  }
};

exports.getMaps = async (req, res) => {
  try {
    const maps = await Map.findAll({ where: { userId: req.userId } });
    res.status(200).json(maps);
  } catch (error) {
    console.error('Error in getMaps endpoint:', error);
    res.status(500).json({ error: 'Failed to retrieve maps' });
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
    res.status(500).json({ error: 'Failed to delete map' });
  }
};
