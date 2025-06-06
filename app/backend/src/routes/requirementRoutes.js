const express = require('express');
const requirementController = require('../controllers/requirementController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Create requirement for a map
router.post('/maps/:mapId/requirements', authenticate, requirementController.createRequirement);

// Get all requirements for a map
router.get('/maps/:mapId/requirements', authenticate, requirementController.getRequirementsByMap);

// Update requirement
router.put('/requirements/:id', authenticate, requirementController.updateRequirement);

// Delete requirement
router.delete('/requirements/:id', authenticate, requirementController.deleteRequirement);

module.exports = router;
