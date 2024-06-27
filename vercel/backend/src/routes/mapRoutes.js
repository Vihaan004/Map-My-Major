const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createMap, getMaps, updateMap, deleteMap } = require('../controllers/mapController');
const router = express.Router();

router.post('/', authenticate, createMap);
router.get('/', authenticate, getMaps);
router.put('/:id', authenticate, updateMap);
router.delete('/:id', authenticate, deleteMap);

module.exports = router;
