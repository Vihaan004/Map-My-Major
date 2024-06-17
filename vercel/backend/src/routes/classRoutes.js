const express = require('express');
const { createClass, getClasses, updateClass, deleteClass } = require('../controllers/classController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createClass);
router.get('/:semesterId', authenticate, getClasses);
router.put('/:id', authenticate, updateClass);
router.delete('/:id', authenticate, deleteClass);

module.exports = router;
