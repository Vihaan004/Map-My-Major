// Classes endpoints
const { initializeModels } = require('./database');
const { corsMiddleware, authenticate, errorHandler } = require('./middleware');

module.exports = async (req, res) => {
  try {
    // Apply CORS
    corsMiddleware(req, res, () => {});
    
    const { Class, Semester, Map } = initializeModels();
    
    // All class routes require authentication
    authenticate(req, res, async () => {
      const { path } = req.query;
      
      if (req.method === 'POST' && path && path[0]) {
        // POST /api/classes/:semesterId - Create class in semester
        const semesterId = path[0];
        
        // Verify semester exists and user owns it
        const semester = await Semester.findByPk(semesterId);
        if (!semester) {
          return res.status(404).json({ error: 'Semester not found' });
        }
        
        const map = await Map.findByPk(semester.mapId);
        if (!map || map.userId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        const classItem = await Class.create({
          name: req.body.name,
          creditHours: req.body.creditHours || req.body.credits || 3,
          requirementTags: req.body.requirementTags || [],
          prerequisites: req.body.prerequisites,
          corequisites: req.body.corequisites,
          status: req.body.status || 'planned',
          semesterId: semesterId
        });
        
        res.status(201).json(classItem);
        
      } else if (req.method === 'GET' && path && path[0]) {
        // GET /api/classes/:semesterId - Get classes in semester
        const semesterId = path[0];
        
        // Verify semester exists and user owns it
        const semester = await Semester.findByPk(semesterId);
        if (!semester) {
          return res.status(404).json({ error: 'Semester not found' });
        }
        
        const map = await Map.findByPk(semester.mapId);
        if (!map || map.userId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        const classes = await Class.findAll({
          where: { semesterId }
        });
        
        res.json(classes);
        
      } else if (req.method === 'PUT' && path && path[0]) {
        // PUT /api/classes/:id - Update class
        const classItem = await Class.findByPk(path[0]);
        
        if (!classItem) {
          return res.status(404).json({ error: 'Class not found' });
        }
        
        // Verify user owns this class
        const semester = await Semester.findByPk(classItem.semesterId);
        const map = await Map.findByPk(semester.mapId);
        if (!map || map.userId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        await classItem.update(req.body);
        res.json(classItem);
        
      } else if (req.method === 'DELETE' && path && path[0]) {
        // DELETE /api/classes/:id - Delete class
        const classItem = await Class.findByPk(path[0]);
        
        if (!classItem) {
          return res.status(404).json({ error: 'Class not found' });
        }
        
        // Verify user owns this class
        const semester = await Semester.findByPk(classItem.semesterId);
        const map = await Map.findByPk(semester.mapId);
        if (!map || map.userId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        await classItem.destroy();
        res.json({ message: 'Class deleted successfully' });
        
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    });
    
  } catch (error) {
    errorHandler(error, req, res, () => {});
  }
};
