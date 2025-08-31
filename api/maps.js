// Maps endpoints
const { initializeModels } = require('./database');
const { corsMiddleware, authenticate, errorHandler } = require('./middleware');

module.exports = async (req, res) => {
  try {
    // Apply CORS
    corsMiddleware(req, res, () => {});
    
    const { Map, Semester, Class } = initializeModels();
    
    // All map routes require authentication
    authenticate(req, res, async () => {
      const { path } = req.query;
      
      if (req.method === 'GET') {
        if (!path || path.length === 0) {
          // GET /api/maps - Get all user's maps
          const maps = await Map.findAll({
            where: { userId: req.user.id },
            include: [{
              model: Semester,
              as: 'semesters',
              include: [{
                model: Class,
                as: 'classes'
              }]
            }],
            order: [['createdAt', 'DESC']]
          });
          
          res.json(maps);
          
        } else if (path[0] === 'id' && path[1]) {
          // GET /api/maps/id/:id - Get map by ID
          const map = await Map.findOne({
            where: { id: path[1], userId: req.user.id },
            include: [{
              model: Semester,
              as: 'semesters',
              include: [{
                model: Class,
                as: 'classes'
              }]
            }]
          });
          
          if (!map) {
            return res.status(404).json({ error: 'Map not found' });
          }
          
          res.json(map);
          
        } else if (path[0]) {
          // GET /api/maps/:name - Get map by name
          const map = await Map.findOne({
            where: { name: decodeURIComponent(path[0]), userId: req.user.id },
            include: [{
              model: Semester,
              as: 'semesters',
              include: [{
                model: Class,
                as: 'classes'
              }]
            }]
          });
          
          if (!map) {
            return res.status(404).json({ error: 'Map not found' });
          }
          
          res.json(map);
        }
        
      } else if (req.method === 'POST') {
        // POST /api/maps - Create new map
        const { name } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'Map name is required' });
        }
        
        const map = await Map.create({
          name,
          userId: req.user.id
        });
        
        res.status(201).json(map);
        
      } else if (req.method === 'PUT' && path && path[0]) {
        // PUT /api/maps/:id - Update map
        const map = await Map.findOne({
          where: { id: path[0], userId: req.user.id }
        });
        
        if (!map) {
          return res.status(404).json({ error: 'Map not found' });
        }
        
        await map.update(req.body);
        res.json(map);
        
      } else if (req.method === 'DELETE' && path && path[0]) {
        // DELETE /api/maps/:id - Delete map
        const map = await Map.findOne({
          where: { id: path[0], userId: req.user.id }
        });
        
        if (!map) {
          return res.status(404).json({ error: 'Map not found' });
        }
        
        await map.destroy();
        res.json({ message: 'Map deleted successfully' });
        
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    });
    
  } catch (error) {
    errorHandler(error, req, res, () => {});
  }
};
