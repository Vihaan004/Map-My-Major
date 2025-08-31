// Semesters endpoints
const { initializeModels } = require('./database');
const { corsMiddleware, authenticate, errorHandler } = require('./middleware');

module.exports = async (req, res) => {
  try {
    // Apply CORS
    corsMiddleware(req, res, () => {});
    
    const { Semester, Map, Class } = initializeModels();
    
    // All semester routes require authentication
    authenticate(req, res, async () => {
      const { path } = req.query;
      
      if (req.method === 'GET' && path && path[0]) {
        // GET /api/semesters/:id - Get semester by ID
        const semester = await Semester.findByPk(path[0], {
          include: [{
            model: Class,
            as: 'classes'
          }]
        });
        
        if (!semester) {
          return res.status(404).json({ error: 'Semester not found' });
        }
        
        // Verify user owns this semester's map
        const map = await Map.findByPk(semester.mapId);
        if (!map || map.userId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json(semester);
        
      } else if (req.method === 'PUT' && path && path[0]) {
        // PUT /api/semesters/:id - Update semester
        const semester = await Semester.findByPk(path[0]);
        
        if (!semester) {
          return res.status(404).json({ error: 'Semester not found' });
        }
        
        // Verify user owns this semester's map
        const map = await Map.findByPk(semester.mapId);
        if (!map || map.userId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        await semester.update(req.body);
        res.json(semester);
        
      } else if (req.method === 'DELETE' && path && path[0]) {
        // DELETE /api/semesters/:id - Delete semester
        const semester = await Semester.findByPk(path[0]);
        
        if (!semester) {
          return res.status(404).json({ error: 'Semester not found' });
        }
        
        // Verify user owns this semester's map
        const map = await Map.findByPk(semester.mapId);
        if (!map || map.userId !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        await semester.destroy();
        res.json({ message: 'Semester deleted successfully' });
        
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    });
    
  } catch (error) {
    errorHandler(error, req, res, () => {});
  }
};
