const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createMap, getMaps, getMapByName, updateMap, deleteMap, addSemester, addClass, deleteSemester, deleteClass } = require('../controllers/mapController');
const router = express.Router();

router.post('/', authenticate, createMap);
router.get('/', authenticate, getMaps);
router.get('/:name', authenticate, getMapByName); // Ensure this line is present
router.put('/:id', authenticate, updateMap);
router.delete('/:id', authenticate, deleteMap);

router.post('/:mapId/semesters', authenticate, addSemester);
router.post('/semesters/:semesterId/classes', authenticate, addClass);
router.delete('/semesters/:semesterId', authenticate, deleteSemester);
router.delete('/classes/:classId', authenticate, deleteClass);

module.exports = router;
