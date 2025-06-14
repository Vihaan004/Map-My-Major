const express = require('express');
const { createClass, getClasses, updateClass, deleteClass } = require('../controllers/classController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Route for semester's classes
router.post('/:semesterId/classes', authenticate, createClass);
router.get('/:semesterId/classes', authenticate, getClasses);

// Routes for specific classes
router.put('/:id', authenticate, updateClass);
router.patch('/:id/status', authenticate, updateClass); // Add specific endpoint for status updates
router.delete('/:id', authenticate, deleteClass);

module.exports = router;
