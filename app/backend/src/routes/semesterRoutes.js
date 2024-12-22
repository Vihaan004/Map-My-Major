const express = require('express');
const { createSemester, getSemesters, updateSemester, deleteSemester } = require('../controllers/semesterController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createSemester);
router.get('/:mapId', authenticate, getSemesters);
router.put('/:id', authenticate, updateSemester);
router.delete('/:id', authenticate, deleteSemester);

module.exports = router;
