// Requirements endpoints
const { initializeModels } = require('./database');
const { corsMiddleware, authenticate, errorHandler } = require('./middleware');

module.exports = async (req, res) => {
  try {
    // Apply CORS
    corsMiddleware(req, res, () => {});
    
    const { Requirement, Map } = initializeModels();
    
    // All requirement routes require authentication
    authenticate(req, res, async () => {
      const { path } = req.query;
      
      if (req.method === 'POST' && path && path[0] === 'requirements') {
        // POST /api/requirements - Create requirement
        const { mapId, name, tag, type, goal, color } = req.body;
        
        // Verify user owns the map
        const map = await Map.findOne({
          where: { id: mapId, userId: req.user.id }
        });
        
        if (!map) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        const requirement = await Requirement.create({
          name,
          tag,
          type,
          goal,
          color: color || '#007bff',
          mapId
        });
        
        res.status(201).json(requirement);
        
      } else if (req.method === 'GET' && path && path[0] === 'requirements' && path[1]) {
        // GET /api/requirements/:mapId - Get requirements for map
        const mapId = path[1];
        
        // Verify user owns the map
        const map = await Map.findOne({
          where: { id: mapId, userId: req.user.id }
        });
        
        if (!map) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        const requirements = await Requirement.findAll({
          where: { mapId }
        });
        
        res.json(requirements);
        
      } else if (req.method === 'PUT' && path && path[0] === 'requirements' && path[1]) {
        // PUT /api/requirements/:id - Update requirement
        const requirement = await Requirement.findByPk(path[1]);
        
        if (!requirement) {
          return res.status(404).json({ error: 'Requirement not found' });
        }
        
        // Verify user owns the map
        const map = await Map.findOne({
          where: { id: requirement.mapId, userId: req.user.id }
        });
        
        if (!map) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        await requirement.update(req.body);
        res.json(requirement);
        
      } else if (req.method === 'DELETE' && path && path[0] === 'requirements' && path[1]) {
        // DELETE /api/requirements/:id - Delete requirement
        const requirement = await Requirement.findByPk(path[1]);
        
        if (!requirement) {
          return res.status(404).json({ error: 'Requirement not found' });
        }
        
        // Verify user owns the map
        const map = await Map.findOne({
          where: { id: requirement.mapId, userId: req.user.id }
        });
        
        if (!map) {
          return res.status(403).json({ error: 'Access denied' });
        }
        
        await requirement.destroy();
        res.json({ message: 'Requirement deleted successfully' });
        
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    });
    
  } catch (error) {
    errorHandler(error, req, res, () => {});
  }
};
