const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createMap, getMaps, getMapByName, getMapById, updateMap, deleteMap, addSemester, updateSemester, addClass, updateClass, deleteSemester, deleteClass } = require('../controllers/mapController');
const router = express.Router();

router.post('/', authenticate, createMap);
router.get('/', authenticate, getMaps);
router.get('/id/:id', authenticate, getMapById); // Get map by ID
router.get('/:name', authenticate, getMapByName); // Get map by name
router.put('/:id', authenticate, updateMap);
router.delete('/:id', authenticate, deleteMap);

router.post('/:mapId/semesters', authenticate, addSemester);
router.put('/semesters/:semesterId', authenticate, updateSemester);
router.post('/semesters/:semesterId/classes', authenticate, addClass);
router.put('/classes/:classId', authenticate, updateClass);
router.delete('/semesters/:semesterId', authenticate, deleteSemester);
router.delete('/classes/:classId', authenticate, deleteClass);

module.exports = router;
