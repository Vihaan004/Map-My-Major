const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createMap, getMaps, getMapByName, updateMap, deleteMap, addSemester, addClass, deleteSemester, deleteClass } = require('../controllers/mapController');
const router = express.Router();

router.post('/', authenticate, createMap);
router.get('/', authenticate, getMaps);
router.get('/:name', authenticate, getMapByName); // Update this line to get map by name
router.put('/:id', authenticate, updateMap);
router.delete('/:id', authenticate, deleteMap);

router.post('/:mapId/semesters', addSemester);
router.post('/semesters/:semesterId/classes', addClass);
router.delete('/semesters/:semesterId', deleteSemester);
router.delete('/classes/:classId', deleteClass);

module.exports = router;
